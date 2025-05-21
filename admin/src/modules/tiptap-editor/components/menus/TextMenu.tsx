import React, { useCallback } from "react";
import { useTiptapContext } from "../Provider";
import isTextSelected from "../../utils/isTextSelected";
import { isNodeSelected } from "../../utils/isNodeSelected";
import { BubbleMenu } from "@tiptap/react";
import { Toolbar } from "../ui/Toolbar";

export const TextMenu = ({ enable }: { enable: boolean }) => {
  const { editor } = useTiptapContext();

  const shouldShow = useCallback(({ view, editor }: any) => {
    if (!view || editor.view.dragging) {
      return false;
    }

    if (isNodeSelected(editor)) {
      return false;
    }

    return isTextSelected(editor);
  }, []);

  if (!enable) return null;

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={"text-bubble"}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: "top-start",
        maxWidth: "auto",
        appendTo: "parent",
      }}
    >
      <Toolbar></Toolbar>
    </BubbleMenu>
  );
};
