// 分类管理页面
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Loading } from '../../components/ui/Loading';
import { Modal } from '../../components/ui/Modal';
import { useCategoryStore } from '../../store/category';
import { validateCategoryName } from '../../utils/validators';
import { Category } from '../../types';

export const CategoriesPage: React.FC = () => {
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      await fetchCategories();
    } catch (error: any) {
      console.error('加载分类失败:', error);
    }
  };

  const handleCreate = () => {
    setCategoryName('');
    setError('');
    setShowCreateModal(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setError('');
    setShowEditModal(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateCategoryName(categoryName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await addCategory(categoryName);
      setShowCreateModal(false);
      setCategoryName('');
      alert('分类创建成功！');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    
    setError('');

    const validationError = validateCategoryName(categoryName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await updateCategory(selectedCategory.id, categoryName);
      setShowEditModal(false);
      setCategoryName('');
      setSelectedCategory(null);
      alert('分类更新成功！');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    setSubmitting(true);
    try {
      await deleteCategory(selectedCategory.id);
      setShowDeleteModal(false);
      setSelectedCategory(null);
      alert('分类删除成功！');
    } catch (error: any) {
      alert('删除失败: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setCategoryName('');
    setError('');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* 标题和创建按钮 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
          <Button onClick={handleCreate}>
            <Plus className="mr-2" size={18} />
            创建分类
          </Button>
        </div>

        {/* 分类列表 */}
        {loading ? (
          <Loading message="正在加载分类..." />
        ) : categories.length === 0 ? (
          <Card className="text-center py-12">
            <FolderOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无分类</h3>
            <p className="text-gray-600 mb-6">创建第一个分类来组织你的笔记吧！</p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2" size={18} />
              创建分类
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FolderOpen className="text-blue-600 mr-2" size={24} />
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      创建于 {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onClick={() => handleEdit(category)}
                  >
                    <Edit size={14} className="mr-1" />
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    fullWidth
                    onClick={() => handleDeleteClick(category)}
                  >
                    <Trash2 size={14} className="mr-1" />
                    删除
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 创建分类 Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModals}
        title="创建分类"
      >
        <form onSubmit={handleSubmitCreate}>
          <Input
            label="分类名称"
            name="name"
            type="text"
            placeholder="请输入分类名称"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            error={error}
            fullWidth
            autoFocus
          />
          <div className="flex space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleCloseModals}
              disabled={submitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={submitting}
              disabled={submitting}
            >
              创建
            </Button>
          </div>
        </form>
      </Modal>

      {/* 编辑分类 Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        title="编辑分类"
      >
        <form onSubmit={handleSubmitEdit}>
          <Input
            label="分类名称"
            name="name"
            type="text"
            placeholder="请输入分类名称"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            error={error}
            fullWidth
            autoFocus
          />
          <div className="flex space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleCloseModals}
              disabled={submitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={submitting}
              disabled={submitting}
            >
              保存
            </Button>
          </div>
        </form>
      </Modal>

      {/* 删除确认 Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        title="确认删除"
      >
        <div className="py-4">
          <p className="text-gray-700 mb-6">
            确定要删除分类「{selectedCategory?.name}」吗？
            <br />
            <span className="text-sm text-red-600">注意：如果该分类下有笔记，将无法删除。</span>
          </p>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleCloseModals}
              disabled={submitting}
            >
              取消
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleConfirmDelete}
              loading={submitting}
              disabled={submitting}
            >
              确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
