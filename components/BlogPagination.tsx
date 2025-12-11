import React from "react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginTop: "32px"
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "8px 16px",
          background: currentPage === 1 ? "#ccc" : "#444",
          color: "white",
          border: "none",
          cursor: currentPage === 1 ? "default" : "pointer",
          borderRadius: "6px"
        }}
      >
        قبلی
      </button>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 16px",
          background: currentPage === totalPages ? "#ccc" : "#444",
          color: "white",
          border: "none",
          cursor: currentPage === totalPages ? "default" : "pointer",
          borderRadius: "6px"
        }}
      >
        بعدی
      </button>
    </div>
  );
};

export default BlogPagination;
