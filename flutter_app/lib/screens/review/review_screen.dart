import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme_config.dart';
import '../../models/task.dart';
import '../../providers/task_provider.dart';
import '../../utils/date_utils.dart' as app_date_utils;
import 'review_result_dialog.dart';

class ReviewScreen extends StatefulWidget {
  final Task task;

  const ReviewScreen({super.key, required this.task});

  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> {
  Timer? _timer;
  int _remainingSeconds = 0;
  bool _canSubmit = false;
  bool _isSubmitting = false;
  bool _showAiSummary = false;
  late DateTime _startTime;

  @override
  void initState() {
    super.initState();
    _startTime = DateTime.now();
    
    // Start countdown if supervision is enabled
    if (widget.task.isSupervised) {
      _remainingSeconds = widget.task.supervisionDurationSeconds;
      _startCountdown();
    } else {
      _canSubmit = true;
    }
  }

  void _startCountdown() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingSeconds > 0) {
          _remainingSeconds--;
        } else {
          _canSubmit = true;
          timer.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _submitReview(ReviewResult result) async {
    if (!_canSubmit || _isSubmitting) return;

    setState(() {
      _isSubmitting = true;
    });

    final reviewDuration = DateTime.now().difference(_startTime).inSeconds;
    
    final request = ReviewSubmitRequest(
      noteId: widget.task.noteId,
      result: result,
      reviewDurationSeconds: reviewDuration,
    );

    final taskProvider = context.read<TaskProvider>();
    final response = await taskProvider.submitReview(request);

    if (!mounted) return;

    setState(() {
      _isSubmitting = false;
    });

    if (response != null) {
      // Show success dialog
      await showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => ReviewResultDialog(
          result: result,
          nextReviewDate: response.nextReviewDate,
        ),
      );

      if (mounted) {
        // Return to home screen and refresh
        Navigator.of(context).pop();
      }
    } else {
      // Show error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(taskProvider.error ?? '提交失败'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Color _getResultColor(ReviewResult result) {
    switch (result) {
      case ReviewResult.remembered:
        return ThemeConfig.successColor;
      case ReviewResult.fuzzy:
        return ThemeConfig.warningColor;
      case ReviewResult.forgotten:
        return ThemeConfig.errorColor;
    }
  }

  String _getResultText(ReviewResult result) {
    switch (result) {
      case ReviewResult.remembered:
        return '记住了';
      case ReviewResult.fuzzy:
        return '有点模糊';
      case ReviewResult.forgotten:
        return '忘记了';
    }
  }

  IconData _getResultIcon(ReviewResult result) {
    switch (result) {
      case ReviewResult.remembered:
        return Icons.check_circle;
      case ReviewResult.fuzzy:
        return Icons.help;
      case ReviewResult.forgotten:
        return Icons.close;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.task.title),
      ),
      body: Column(
        children: [
          // Supervision countdown (if enabled)
          if (widget.task.isSupervised && !_canSubmit)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              color: Colors.orange[50],
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.timer,
                        size: 24,
                        color: Colors.orange[700],
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '请认真复习',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.orange[700],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '$_remainingSeconds秒',
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: Colors.orange[700],
                    ),
                  ),
                  Text(
                    '倒计时结束后才能提交',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),

          // Content area
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Note content
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.article, size: 20),
                              SizedBox(width: 8),
                              Text(
                                '笔记内容',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            widget.task.content,
                            style: const TextStyle(
                              fontSize: 15,
                              height: 1.6,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // AI Summary (collapsible)
                  if (widget.task.aiSummary != null &&
                      widget.task.aiSummary!.isNotEmpty)
                    Card(
                      child: Column(
                        children: [
                          ListTile(
                            leading: Icon(
                              Icons.auto_awesome,
                              color: Colors.purple[700],
                            ),
                            title: const Text(
                              'AI 总结',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            trailing: Icon(
                              _showAiSummary
                                  ? Icons.expand_less
                                  : Icons.expand_more,
                            ),
                            onTap: () {
                              setState(() {
                                _showAiSummary = !_showAiSummary;
                              });
                            },
                          ),
                          if (_showAiSummary)
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: Text(
                                widget.task.aiSummary!,
                                style: const TextStyle(
                                  fontSize: 15,
                                  height: 1.6,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Review result buttons
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (!_canSubmit)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Text(
                      '倒计时结束后可以提交复习结果',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                Row(
                  children: [
                    Expanded(
                      child: _ReviewResultButton(
                        result: ReviewResult.remembered,
                        color: _getResultColor(ReviewResult.remembered),
                        icon: _getResultIcon(ReviewResult.remembered),
                        text: _getResultText(ReviewResult.remembered),
                        enabled: _canSubmit && !_isSubmitting,
                        isLoading: _isSubmitting,
                        onPressed: () => _submitReview(ReviewResult.remembered),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _ReviewResultButton(
                        result: ReviewResult.fuzzy,
                        color: _getResultColor(ReviewResult.fuzzy),
                        icon: _getResultIcon(ReviewResult.fuzzy),
                        text: _getResultText(ReviewResult.fuzzy),
                        enabled: _canSubmit && !_isSubmitting,
                        isLoading: _isSubmitting,
                        onPressed: () => _submitReview(ReviewResult.fuzzy),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _ReviewResultButton(
                        result: ReviewResult.forgotten,
                        color: _getResultColor(ReviewResult.forgotten),
                        icon: _getResultIcon(ReviewResult.forgotten),
                        text: _getResultText(ReviewResult.forgotten),
                        enabled: _canSubmit && !_isSubmitting,
                        isLoading: _isSubmitting,
                        onPressed: () => _submitReview(ReviewResult.forgotten),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ReviewResultButton extends StatelessWidget {
  final ReviewResult result;
  final Color color;
  final IconData icon;
  final String text;
  final bool enabled;
  final bool isLoading;
  final VoidCallback onPressed;

  const _ReviewResultButton({
    required this.result,
    required this.color,
    required this.icon,
    required this.text,
    required this.enabled,
    required this.isLoading,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: enabled ? onPressed : null,
      style: ElevatedButton.styleFrom(
        backgroundColor: enabled ? color : Colors.grey[300],
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 28),
          const SizedBox(height: 4),
          Text(
            text,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
