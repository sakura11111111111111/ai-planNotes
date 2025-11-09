import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/note_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';
import 'note_edit_screen.dart';

class NoteDetailScreen extends StatefulWidget {
  final int noteId;

  const NoteDetailScreen({super.key, required this.noteId});

  @override
  State<NoteDetailScreen> createState() => _NoteDetailScreenState();
}

class _NoteDetailScreenState extends State<NoteDetailScreen> {
  @override
  void initState() {
    super.initState();
    _loadNote();
  }

  Future<void> _loadNote() async {
    await context.read<NoteProvider>().loadNoteById(widget.noteId);
  }

  Future<void> _handleDelete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('确认删除'),
        content: const Text('确定要删除这条笔记吗？此操作无法撤销。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('删除'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final success =
          await context.read<NoteProvider>().deleteNote(widget.noteId);
      if (mounted) {
        if (success) {
          Navigator.of(context).pop();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('删除成功'),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          final error = context.read<NoteProvider>().error;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error ?? '删除失败'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('笔记详情'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              final note = context.read<NoteProvider>().currentNote;
              if (note != null) {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => NoteEditScreen(noteId: note.noteId),
                  ),
                ).then((_) => _loadNote());
              }
            },
            tooltip: '编辑',
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: _handleDelete,
            tooltip: '删除',
          ),
        ],
      ),
      body: Consumer<NoteProvider>(
        builder: (context, noteProvider, _) {
          if (noteProvider.isLoading) {
            return const LoadingWidget(message: '加载中...');
          }

          if (noteProvider.error != null) {
            return ErrorDisplayWidget(
              message: noteProvider.error!,
              onRetry: _loadNote,
            );
          }

          final note = noteProvider.currentNote;
          if (note == null) {
            return const ErrorDisplayWidget(
              message: '笔记不存在',
            );
          }

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    note.title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

                // Info row
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      if (note.categoryName != null)
                        Chip(
                          avatar: const Icon(Icons.folder, size: 16),
                          label: Text(note.categoryName!),
                          backgroundColor: Colors.blue[50],
                        ),
                      if (note.isSupervised)
                        Chip(
                          avatar: const Icon(Icons.timer, size: 16),
                          label: Text(
                            '监督模式 ${note.supervisionDurationSeconds}秒',
                          ),
                          backgroundColor: Colors.orange[50],
                        ),
                      Chip(
                        avatar: const Icon(Icons.replay, size: 16),
                        label: Text('第 ${note.currentReviewStage} 次复习'),
                        backgroundColor: Colors.grey[100],
                      ),
                    ],
                  ),
                ),

                // Review info
                if (note.nextReviewDate != null)
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue[50],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.event, color: Colors.blue[700]),
                          const SizedBox(width: 8),
                          Text(
                            '下次复习时间：${note.nextReviewDate}',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.blue[700],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                const Divider(),

                // Content
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '笔记内容',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        note.content,
                        style: const TextStyle(
                          fontSize: 15,
                          height: 1.6,
                        ),
                      ),
                    ],
                  ),
                ),

                // AI Summary
                if (note.aiSummary != null && note.aiSummary!.isNotEmpty) ...[
                  const Divider(),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.auto_awesome,
                              size: 20,
                              color: Colors.purple[700],
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'AI 总结',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.purple[50],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            note.aiSummary!,
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

                // Metadata
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '创建时间：${note.createdAt}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '更新时间：${note.updatedAt}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
