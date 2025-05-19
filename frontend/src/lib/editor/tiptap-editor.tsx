import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useCodeMirror } from "./useCodeMirror";
import { formatHtml } from "./format";

interface TiptapEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

const TiptapEditor = forwardRef<HTMLDivElement, TiptapEditorProps>(
  ({ initialContent, onChange }, ref) => {
    const [formattedContent, setFormattedContent] = useState("");
    const editorRef = useCodeMirror({
      initialContent: formattedContent,
      onChange,
    });

    useEffect(() => {
      formatHtml(initialContent).then(setFormattedContent);
    }, [initialContent]);

    useImperativeHandle(ref, () => editorRef.current!, [editorRef]);

    return <div ref={editorRef} />;
  }
);
TiptapEditor.displayName = "SourceEditor";

export default TiptapEditor;
