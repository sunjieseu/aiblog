/**
 * 移除HTML标签,返回纯文本
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  
  // 创建一个临时DOM元素来移除HTML标签
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // 获取纯文本内容
  const text = tempDiv.textContent || tempDiv.innerText || '';
  
  // 移除多余的空白字符
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * 将Markdown转换为纯文本
 */
export const stripMarkdown = (markdown: string): string => {
  if (!markdown) return '';
  
  let text = markdown;
  
  // 移除标题标记 (# ## ### 等)
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // 移除粗体标记 (**text** 或 __text__)
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/__(.*?)__/g, '$1');
  
  // 移除斜体标记 (*text* 或 _text_)
  text = text.replace(/\*(.*?)\*/g, '$1');
  text = text.replace(/_(.*?)_/g, '$1');
  
  // 移除删除线标记 (~~text~~)
  text = text.replace(/~~(.*?)~~/g, '$1');
  
  // 移除代码标记 (`code`)
  text = text.replace(/`(.*?)`/g, '$1');
  
  // 移除代码块标记 (```code```)
  text = text.replace(/```[\s\S]*?```/g, '');
  
  // 移除链接标记 [text](url)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // 移除图片标记 ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  
  // 移除表格标记
  text = text.replace(/\|/g, ' ');
  text = text.replace(/^[\s\-:|]+$/gm, '');
  
  // 移除列表标记
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');
  
  // 移除引用标记 (>)
  text = text.replace(/^>\s+/gm, '');
  
  // 移除水平线标记 (--- 或 ***)
  text = text.replace(/^[-*]{3,}$/gm, '');
  
  // 移除多余的空白字符
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * 截取文本到指定长度
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};