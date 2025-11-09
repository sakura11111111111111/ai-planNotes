// 笔记详情页面
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Sparkles, Tag, Shield, Calendar } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { Modal } from '../../components/ui/Modal';
import { useNoteStore } from '../../store/note';
import { formatDateTime } from '../../utils/date';

export const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentNote, loading, fetchNoteById, deleteNote, generateSummary } = useNoteStore();
  
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      loadNote(parseInt(id));
    }
  }, [id]);

  const loadNote = async (noteId: number) => {
    try {
      await fetchNoteById(noteId);
    } catch (error: any) {
      console.error('加载笔记失败:', error);
      alert('加载笔记失败: ' + error.message);
      navigate('/notes');
    }
  };

  const handleEdit = () => {
    if (currentNote) {
      navigate(`/notes/${currentNote.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!currentNote) return;
    
    setDeleting(true);
    try {
      await deleteNote(currentNote.id);
      navigate('/notes');
    } catch (error: any) {
      alert('删除失败: ' + error.message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!currentNote) return;
    
    setGenerating(true);
    try {
      await generateSummary(currentNote.id);
      alert('AI 总结生成成功！');
    } catch (error: any) {
      alert('生成失败: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !currentNote) {
    return (
      <Layout>
        <Loading fullScreen message="正在加载笔记..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* 标题栏 */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentNote.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {currentNote.categoryName && (
                  <div className="flex items-center">
                    <Tag className="mr-1" size={16} />
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                      {currentNote.categoryName}
                    </span>
                  </div>
                )}
                {currentNote.isSupervised && (
                  <div className="flex items-center">
                    <Shield className="mr-1 text-orange-500" size={16} />
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md font-medium">
                      监督模式 {currentNote.supervisionDurationSeconds}s
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={handleEdit}>
                <Edit className="mr-2" size={18} />
                编辑
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="mr-2" size={18} />
                删除
              </Button>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Calendar className="mr-1" size={14} />
              创建于 {formatDateTime(currentNote.createdAt)}
            </div>
            {currentNote.updatedAt && currentNote.updatedAt !== currentNote.createdAt && (
              <div>更新于 {formatDateTime(currentNote.updatedAt)}</div>
            )}
          </div>
        </Card>

        {/* 笔记内容 */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">笔记内容</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {currentNote.content}
          </div>
        </Card>

        {/* AI 总结 */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Sparkles className="text-purple-600 mr-2" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">AI 总结</h2>
            </div>
            {!currentNote.aiSummary && (
              <Button
                variant="primary"
                onClick={handleGenerateSummary}
                loading={generating}
                disabled={generating}
              >
                生成 AI 总结
              </Button>
            )}
          </div>

          {currentNote.aiSummary ? (
            <div>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-purple-50 p-4 rounded-lg">
                {currentNote.aiSummary.summaryText}
              </div>
              <div className="mt-3 text-sm text-gray-500 flex items-center justify-between">
                <span>生成时间: {formatDateTime(currentNote.aiSummary.createdAt)}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleGenerateSummary}
                  loading={generating}
                  disabled={generating}
                >
                  重新生成
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>还没有 AI 总结，点击上方按钮生成</p>
            </div>
          )}
        </Card>

        {/* 复习记录 */}
        {currentNote.currentReviewRecord && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">复习进度</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">当前阶段</div>
                <div className="text-2xl font-bold text-blue-600">
                  第 {currentNote.currentReviewRecord.stageNumber} 次
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">下次复习</div>
                <div className="text-xl font-bold text-green-600">
                  {currentNote.currentReviewRecord.scheduledFor}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 删除确认 Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="确认删除"
      >
        <div className="py-4">
          <p className="text-gray-700 mb-6">
            确定要删除笔记「{currentNote?.title}」吗？此操作不可恢复。
          </p>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
            >
              取消
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
            >
              确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
