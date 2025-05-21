import { useCallback } from "react";
import { BubbleMenu, useEditorState } from "@tiptap/react";
import useCopyToClipboard from "../../../hooks/useCopyToClipboard";
import { useTiptapContext } from "../../Provider";
import { getNodeContainer } from "../../../utils/getNodeContainer";
import { Toolbar } from "../../ui/Toolbar";
import CodeDropdown from "./CodeDropdown";

export const CodeBlockMenu = () => {
  const { editor, contentElement } = useTiptapContext();
  const { isCopied, copy } = useCopyToClipboard();

  const language = useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx.editor.isActive("codeBlock"))
        return ctx.editor.getAttributes("codeBlock").language;
      return null;
    },
  });

  const shouldShow = useCallback(({ editor }: any) => {
    return editor.isActive("codeBlock");
  }, []);

  const handleSelect = useCallback(
    (value: string) =>
      editor.commands.updateAttributes("codeBlock", { language: value }),
    [editor]
  );

  const handleCopy = useCallback(() => {
    const node = getNodeContainer(editor, "pre");
    if (node?.textContent) {
      copy(node.textContent);
    }
  }, [editor]);

  const getReferenceClientRect = useCallback(() => {
    const node = getNodeContainer(editor, "pre");
    return node?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0);
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={"code-block-bubble"}
      shouldShow={shouldShow}
      updateDelay={100}
      tippyOptions={{
        placement: "top",
        maxWidth: "auto",
        appendTo: () => contentElement.current!,
        getReferenceClientRect,
      }}
    >
      <Toolbar>
        <CodeDropdown value={language} onSelect={handleSelect} />
      </Toolbar>
    </BubbleMenu>
  );
};
