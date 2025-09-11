import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../index';

interface AuthorInfo {
  name: string;
  bio: string;
  avatar?: string;
  specialties: string[];
  experience: string;
}

interface HeroProps {
  authorInfo: AuthorInfo;
}

const Hero: React.FC<HeroProps> = ({ authorInfo }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-gray-800 text-white">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左侧内容 */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-light tracking-tight">
                欢迎来到
                <span className="block font-medium">{authorInfo.name}的创作空间</span>
              </h1>
              <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
                {authorInfo.bio}
              </p>
            </div>
            
            {/* 专业技能标签 */}
            <div className="flex flex-wrap gap-3">
              {authorInfo.specialties.map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="neutral" 
                  className="bg-white/20 text-white ring-white/30 backdrop-blur-sm"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
            
            {/* CTA按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="large" 
                className="bg-white text-primary hover:bg-gray-100 shadow-lg"
                asChild
              >
                <Link to="/commission">
                  开始约稿
                </Link>
              </Button>
              <Button 
                size="large" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/articles">
                  查看作品
                </Link>
              </Button>
            </div>
          </div>
          
          {/* 右侧头像/装饰 */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* 头像容器 */}
              <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                {authorInfo.avatar ? (
                  <img 
                    src={authorInfo.avatar} 
                    alt={authorInfo.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-6xl lg:text-8xl font-light text-white">
                    {authorInfo.name.charAt(0)}
                  </span>
                )}
              </div>
              
              {/* 装饰元素 */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/30 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/20 rounded-full" />
              
              {/* 经验标签 */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <Badge 
                  variant="info" 
                  className="bg-white text-primary shadow-lg"
                >
                  {authorInfo.experience} 经验
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;