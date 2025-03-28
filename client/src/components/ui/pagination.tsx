import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
  // Helper để tạo mảng số trang hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Tối đa hiển thị 5 trang một lúc
    
    if (totalPages <= maxPagesToShow) {
      // Hiển thị tất cả các trang nếu tổng số trang < maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu, trang cuối, trang hiện tại, và 1-2 trang kế cận
      // Trang đầu
      pageNumbers.push(1);
      
      // Trang ở giữa
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Thêm dấu "..." nếu cần thiết
      if (startPage > 2) {
        pageNumbers.push(-1); // -1 đại diện cho "..."
      }
      
      // Thêm các trang ở giữa
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Thêm dấu "..." nếu cần thiết
      if (endPage < totalPages - 1) {
        pageNumbers.push(-2); // -2 đại diện cho "..." thứ hai
      }
      
      // Trang cuối
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center space-x-2 mt-10", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((pageNum, index) => {
        // Hiển thị dấu "..."
        if (pageNum < 0) {
          return (
            <span key={`ellipsis-${index}`} className="mx-1 text-muted-foreground">
              ...
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${pageNum}`}
            variant={currentPage === pageNum ? "default" : "outline"}
            onClick={() => onPageChange(pageNum)}
            className="w-8 h-8 p-0"
          >
            {pageNum}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
