import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-zinc-950 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20 mb-6">
          <span className="text-xs font-medium text-accent-foreground">Lỗi 404</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-gradient">
          Không Tìm Thấy Trang
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Button asChild size="lg" className="rounded-full">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trở Về Trang Chủ
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
