// 笔记编辑页面（创建和编辑）
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useNoteStore } from '../../store/note';
import { useCategoryStore } from '../../store/category';
import { validateNoteTitle, validateNoteContent, validateSupervisionDuration } from '../../utils/validators';
import { CreateNoteRequest, UpdateNoteRequest } from '../../types';

export const NoteEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { currentNote, loading, fetchNoteById, createNote, updateNote } = useNoteStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: undefined as number | undefined,
    isSupervised: false,
    supervisionDurationSeconds: 30,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
    if (isEditMode && id) {
      loadNote(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode && currentNote) {
      setFormData({
        title: currentNote.title,
        content: currentNote.content,
        categoryId: currentNote.categoryId || undefined,
        isSupervised: currentNote.isSupervised,
        supervisionDurationSeconds: currentNote.supervisionDurationSeconds || 30,
      });
    }
  }, [currentNote, isEditMode]);

  const loadCategories = async () => {
    try {
      await fetchCategories();
    } catch (error: any) {
      console.error('加载分类失败:', error);
    }
  };

  const loadNote = async (noteId: number) => {
    try {
      await fetchNoteById(noteId);
    } catch (error: any) {
      console.error('加载笔记失败:', error);
      alert('加载笔记失败: ' + error.message);
      navigate('/notes');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'categoryId') {
      const categoryId = value ? parseInt(value) : undefined;
      setFormData((prev) => ({ ...prev, categoryId }));
    } else if (name === 'supervisionDurationSeconds') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 30 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // 清除该字段的错误
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleError = validateNoteTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    const contentError = validateNoteContent(formData.content);
    if (contentError) newErrors.content = contentError;

    if (formData.isSupervised) {
      const durationError = validateSupervisionDuration(formData.supervisionDurationSeconds);
      if (durationError) newErrors.supervisionDurationSeconds = durationError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const data: CreateNoteRequest | UpdateNoteRequest = {
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId || null,
        isSupervised: formData.isSupervised,
        supervisionDurationSeconds: formData.isSupervised ? formData.supervisionDurationSeconds : undefined,
      };

      if (isEditMode && id) {
        await updateNote(parseInt(id), data);
        alert('笔记更新成功！');
        navigate(`/notes/${id}`);
      } else {
        const newNote = await createNote(data);
        alert('笔记创建成功！');
        navigate(`/notes/${newNote.id}`);
      }
    } catch (error: any) {
      alert('保存失败: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(`/notes/${id}`);
    } else {
      navigate('/notes');
    }
  };

  if (loading && isEditMode && !currentNote) {
    return (
      <Layout>
        <Loading fullScreen message="正在加载笔记..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? '编辑笔记' : '创建笔记'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 标题 */}
            <Input
              label="标题"
              name="title"
              type="text"
              placeholder="请输入笔记标题"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              fullWidth
              required
            />

            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              <select
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">无分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 内容 */}
            <Textarea
              label="内容"
              name="content"
              placeholder="请输入笔记内容"
              value={formData.content}
              onChange={handleChange}
              error={errors.content}
              fullWidth
              rows={12}
              required
            />

            {/* 监督机制 */}
            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isSupervised"
                  name="isSupervised"
                  checked={formData.isSupervised}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isSupervised" className="ml-2 text-sm font-medium text-gray-700">
                  启用监督机制（复习时需要等待倒计时）
                </label>
              </div>

              {formData.isSupervised && (
                <Input
                  label="监督时长（秒）"
                  name="supervisionDurationSeconds"
                  type="number"
                  min="10"
                  max="300"
                  placeholder="请输入监督时长（10-300秒）"
                  value={formData.supervisionDurationSeconds}
                  onChange={handleChange}
                  error={errors.supervisionDurationSeconds}
                  fullWidth
                />
              )}
            </div>

            {/* 按钮 */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                fullWidth
                loading={submitting}
                disabled={submitting}
              >
                <Save className="mr-2" size={18} />
                {isEditMode ? '保存修改' : '创建笔记'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleCancel}
                disabled={submitting}
              >
                <X className="mr-2" size={18} />
                取消
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};
