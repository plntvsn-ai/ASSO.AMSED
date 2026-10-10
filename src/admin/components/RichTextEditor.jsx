import React, { useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, 
  List, ListOrdered, Quote, Link, Undo, Redo 
} from 'lucide-react';

export const RichTextEditor = ({ value, onChange, placeholder = "اكتب محتوى المقال هنا..." }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt("أدخل رابط الموقع (URL):", "https://");
    if (url) {
      exec("createLink", url);
    }
  };

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition">
      {/* Formatting Toolbar */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1 text-slate-700">
        <button
          type="button"
          onClick={() => exec("bold")}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition"
          title="عريض (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition"
          title="مائل (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition"
          title="تسطير (Underline)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1"></span>

        <button
          type="button"
          onClick={() => exec("formatBlock", "<h2>")}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition font-bold text-xs"
          title="عنوان رئيسي (H2)"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h3>")}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition font-bold text-xs"
          title="عنوان فرعي (H3)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1"></span>

        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition"
          title="قائمة نقطية"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition"
          title="قائمة مرقمة"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<blockquote>")}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition"
          title="اقتباس (Quote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1"></span>

        <button
          type="button"
          onClick={addLink}
          className="p-1.5 hover:bg-slate-200 rounded-lg transition"
          title="إضافة رابط"
        >
          <Link className="w-4 h-4" />
        </button>

        <div className="ms-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => exec("undo")}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition"
            title="تراجع"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => exec("redo")}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition"
            title="إعادة"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[220px] max-h-[450px] overflow-y-auto focus:outline-none prose prose-sm max-w-none text-slate-800 leading-relaxed"
        data-placeholder={placeholder}
      />
    </div>
  );
};
