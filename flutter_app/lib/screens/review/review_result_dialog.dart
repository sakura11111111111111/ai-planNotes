import 'package:flutter/material.dart';
import '../../models/task.dart';
import '../../utils/date_utils.dart' as app_date_utils;

class ReviewResultDialog extends StatelessWidget {
  final ReviewResult result;
  final String nextReviewDate;

  const ReviewResultDialog({
    super.key,
    required this.result,
    required this.nextReviewDate,
  });

  Color _getColor() {
    switch (result) {
      case ReviewResult.remembered:
        return Colors.green;
      case ReviewResult.fuzzy:
        return Colors.orange;
      case ReviewResult.forgotten:
        return Colors.red;
    }
  }

  IconData _getIcon() {
    switch (result) {
      case ReviewResult.remembered:
        return Icons.check_circle;
      case ReviewResult.fuzzy:
        return Icons.info;
      case ReviewResult.forgotten:
        return Icons.refresh;
    }
  }

  String _getMessage() {
    switch (result) {
      case ReviewResult.remembered:
        return '太棒了！继续保持！';
      case ReviewResult.fuzzy:
        return '加油！多复习几次会更好！';
      case ReviewResult.forgotten:
        return '没关系，我们再复习一次！';
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _getIcon(),
            size: 80,
            color: _getColor(),
          ),
          const SizedBox(height: 16),
          Text(
            '复习完成',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _getMessage(),
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                const Text(
                  '下次复习时间',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  nextReviewDate,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  app_date_utils.DateTimeUtils.formatRelativeDate(
                    nextReviewDate,
                  ),
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.blue[700],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: const Text(
            '确定',
            style: TextStyle(fontSize: 16),
          ),
        ),
      ],
    );
  }
}
