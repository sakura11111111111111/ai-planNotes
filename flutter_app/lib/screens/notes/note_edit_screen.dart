import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/note.dart';
import '../../providers/note_provider.dart';
import '../../providers/category_provider.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';

class NoteEditScreen extends StatefulWidget {
  final int? noteId;

  const NoteEditScreen({super.key, this.noteId});

  @override
  State<NoteEditScreen> createState() => _NoteEditScreenState();
}

class _NoteEditScreenState extends State<NoteEditScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  final _supervisionDurationController = TextEditingController(text: '10');
  
  int? _selectedCategoryId;
  bool _isSupervised = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await context.read<CategoryProvider>().loadCategories();
    
    if (widget.noteId != null) {
      await context.read<NoteProvider>().loadNoteById(widget.noteId!);
      final note = context.read<NoteProvider>().currentNote;
      if (note != null) {
        _titleController.text = note.title;
        _contentController.text = note.content;
        _selectedCategoryId = note.categoryId;
        _isSupervised = note.isSupervised;
        _supervisionDurationController.text =
            note.supervisionDurationSeconds.toString();
        setState(() {});
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    _supervisionDurationController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      final request = NoteCreateRequest(
        title: _titleController.text.trim(),
        content: _contentController.text.trim(),
        categoryId: _selectedCategoryId,
        isSupervised: _isSupervised,
        supervisionDurationSeconds: int.parse(_supervisionDurationController.text),
      );

      final noteProvider = context.read<NoteProvider>();
      bool success;

      if (widget.noteId != null) {
        // Update existing note
        success = await noteProvider.updateNote(widget.noteId!, request);
      } else {
        // Create new note
        success = await noteProvider.createNote(request);
      }

      if (mounted) {
        setState(() {
          _isLoading = false;
        });

        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                widget.noteId != null
                    ? '笔记已更新'
                    : '笔记已创建，已加入今日复习计划',
              ),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.of(context).pop();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(noteProvider.error ?? '保存失败'),
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
        title: Text(widget.noteId != null ? '编辑笔记' : '新建笔记'),
        actions: [
          IconButton(
            icon: const Icon(Icons.check),
            onPressed: _isLoading ? null : _handleSave,
            tooltip: '保存',
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Title field
            CustomTextField(
              controller: _titleController,
              labelText: '标题',
              hintText: '请输入笔记标题',
              validator: Validators.validateTitle,
            ),
            const SizedBox(height: 16),

            // Content field
            CustomTextField(
              controller: _contentController,
              labelText: '内容',
              hintText: '请输入笔记内容',
              maxLines: 10,
              validator: Validators.validateContent,
            ),
            const SizedBox(height: 16),

            // Category dropdown
            Consumer<CategoryProvider>(
              builder: (context, categoryProvider, _) {
                return DropdownButtonFormField<int?>(
                  value: _selectedCategoryId,
                  decoration: const InputDecoration(
                    labelText: '分类',
                    hintText: '选择分类（可选）',
                    border: OutlineInputBorder(),
                  ),
                  items: [
                    const DropdownMenuItem(
                      value: null,
                      child: Text('无分类'),
                    ),
                    ...categoryProvider.categories.map((category) {
                      return DropdownMenuItem(
                        value: category.categoryId,
                        child: Text(category.name),
                      );
                    }),
                  ],
                  onChanged: (value) {
                    setState(() {
                      _selectedCategoryId = value;
                    });
                  },
                );
              },
            ),
            const SizedBox(height: 24),

            // Supervision settings
            const Text(
              '监督设置',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SwitchListTile(
                      title: const Text('开启监督机制'),
                      subtitle: const Text('强制最少复习时长，防止走马观花'),
                      value: _isSupervised,
                      onChanged: (value) {
                        setState(() {
                          _isSupervised = value;
                        });
                      },
                      contentPadding: EdgeInsets.zero,
                    ),
                    
                    if (_isSupervised) ...[
                      const SizedBox(height: 16),
                      CustomTextField(
                        controller: _supervisionDurationController,
                        labelText: '监督时长（秒）',
                        hintText: '建议10-60秒',
                        keyboardType: TextInputType.number,
                        validator: Validators.validateSupervisionDuration,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '💡 提示：设置复习时必须阅读的最少时长，倒计时结束前无法提交',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Save button
            CustomButton(
              text: widget.noteId != null ? '保存' : '创建',
              onPressed: _handleSave,
              isLoading: _isLoading,
            ),
            const SizedBox(height: 8),
            
            // Cancel button
            OutlinedButton(
              onPressed: _isLoading
                  ? null
                  : () {
                      Navigator.of(context).pop();
                    },
              child: const Text('取消'),
            ),
          ],
        ),
      ),
    );
  }
}
