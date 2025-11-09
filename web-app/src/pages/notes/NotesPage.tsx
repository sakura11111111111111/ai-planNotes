// 笔记列表页面
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, StickyNote, Tag, Shield } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useNoteStore } from '../../store/note';
import { useCategoryStore } from '../../store/category';
import { formatRelativeTime } from '../../utils/date';

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { notes, loading, fetchNotes } = useNoteStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const [selectedCategory, setSelectedCategory] = useState<number | null | 'all'>('all');

  useEffect(() => {
    loadCategories();
    loadNotes();
  }, []);

  const loadCategories = async () => {
    try {
      await fetchCategories();
    } catch (error: any) {
      console.error('加载分类失败:', error);
    }
  };

  const loadNotes = async (categoryId?: number | null) => {
    try {
      if (categoryId === null) {
        // 获取未分类笔记
        await fetchNotes(null);
      } else if (categoryId) {
        // 获取指定分类笔记
        await fetchNotes(categoryId);
      } else {
        // 获取所有笔记
        await fetchNotes();
      }
    } catch (error: any) {
      console.error('加载笔记失败:', error);
    }
  };

  const handleCategoryFilter = (categoryId: number | null | 'all') => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      loadNotes();
    } else {
      loadNotes(categoryId);
    }
  };

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleNoteClick = (noteId: number) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧：分类筛选 */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">分类筛选</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter('all')}
                  className={`
                    w-full text-left px-3 py-2 rounded-md transition-colors
                    ${selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <Tag className="inline mr-2" size={16} />
                  全部笔记
                </button>
                
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md transition-colors
                    ${selectedCategory === null
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <Tag className="inline mr-2" size={16} />
                  未分类
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-md transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    <Tag className="inline mr-2" size={16} />
                    {category.name}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          {/* 右侧：笔记列表 */}
          <main className="flex-1">
            {/* 标题和创建按钮 */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">我的笔记</h1>
              <Button onClick={handleCreateNote}>
                <Plus className="mr-2" size={18} />
                创建笔记
              </Button>
            </div>

            {/* 笔记列表 */}
            {loading ? (
              <Loading message="正在加载笔记..." />
            ) : notes.length === 0 ? (
              <Card className="text-center py-12">
                <StickyNote className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无笔记</h3>
                <p className="text-gray-600 mb-6">开始创建你的第一条笔记吧！</p>
                <Button onClick={handleCreateNote}>
                  <Plus className="mr-2" size={18} />
                  创建笔记
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <Card
                    key={note.id}
                    hover
                    onClick={() => handleNoteClick(note.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
                        {note.title}
                      </h3>
                      {note.isSupervised && (
                        <Shield className="text-orange-500 flex-shrink-0 ml-2" size={20} />
                      )}
                    </div>

                    {note.aiSummaryPreview && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {note.aiSummaryPreview}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatRelativeTime(note.createdAt)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};
