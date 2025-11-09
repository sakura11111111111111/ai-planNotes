// 首页 - 今日任务
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, BookOpen, Tag, Trophy } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useTaskStore } from '../../store/task';
import { formatDate } from '../../utils/date';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, loading, fetchTodayTasks } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      await fetchTodayTasks();
    } catch (error: any) {
      console.error('加载任务失败:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleStartReview = (noteId: number) => {
    navigate(`/review/${noteId}`);
  };

  if (loading && tasks.length === 0) {
    return (
      <Layout>
        <Loading fullScreen message="正在加载今日任务..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* 标题和刷新按钮 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">今日任务</h1>
            <p className="text-gray-600 mt-1">{formatDate(new Date())}</p>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            loading={refreshing}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={18} />
            刷新
          </Button>
        </div>

        {/* 任务列表 */}
        {tasks.length === 0 ? (
          <Card className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <Trophy className="text-green-600" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">太棒了！</h3>
            <p className="text-gray-600 mb-6">今天没有需要复习的任务，好好休息吧~</p>
            <Button onClick={() => navigate('/notes')}>
              去创建笔记
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              共有 <span className="font-semibold text-blue-600">{tasks.length}</span> 个任务待复习
            </div>
            
            {tasks.map((task) => (
              <Card key={task.noteId} hover className="animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    {/* 标题 */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      <BookOpen className="mr-2 text-blue-600" size={20} />
                      {task.title}
                    </h3>

                    {/* 分类和复习阶段 */}
                    <div className="flex items-center space-x-3 mb-3">
                      {task.categoryName && (
                        <div className="flex items-center text-sm">
                          <Tag className="mr-1 text-gray-400" size={14} />
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                            {task.categoryName}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-600">
                        复习阶段: <span className="font-medium">第 {task.currentReviewStage} 次</span>
                      </span>
                      {task.isSupervised && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">
                          监督模式 {task.supervisionDurationSeconds}s
                        </span>
                      )}
                    </div>

                    {/* AI 总结预览 */}
                    {task.aiSummary && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        <span className="font-medium text-gray-700">AI 总结: </span>
                        {task.aiSummary.length > 100
                          ? `${task.aiSummary.substring(0, 100)}...`
                          : task.aiSummary}
                      </div>
                    )}
                  </div>

                  {/* 开始复习按钮 */}
                  <div className="md:ml-4">
                    <Button
                      onClick={() => handleStartReview(task.noteId)}
                      variant="primary"
                      size="lg"
                    >
                      开始复习
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
