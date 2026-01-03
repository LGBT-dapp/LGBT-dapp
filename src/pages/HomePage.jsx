import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, MessageCircle, TrendingUp } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useAuthStore } from '../stores/authStore';

const HomePage = () => {
  const { user } = useAuthStore();

  const quickActions = [
    { icon: Heart, label: '我的关注', color: 'bg-pink-500' },
    { icon: Users, label: '社群', color: 'bg-purple-500' },
    { icon: MessageCircle, label: '私信', color: 'bg-blue-500' },
    { icon: TrendingUp, label: '热门', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                欢迎回来！
              </h1>
              <p className="text-gray-600 mt-1">
                发现属于你的社交空间
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600">
                  探索更多可能
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            今日推荐
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">🏳️‍🌈</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">LGBTQ+ 友善空间</h3>
                <p className="text-sm text-gray-600">加入我们的包容性社区</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">💬</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">安全聊天室</h3>
                <p className="text-sm text-gray-600">端到端加密的私密对话</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;


