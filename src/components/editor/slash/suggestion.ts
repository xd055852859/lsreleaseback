import tippy from "tippy.js";
import { VueRenderer } from "@tiptap/vue-3";
import SlashList from "./slashList.vue";
export default {
  items: ({ editor, query }) => {
    const isTable = editor.isActive("table");
    if (isTable) {
      return [
        {
          title: "addColumnBefore",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addColumnBefore().run();
          },
        },
        {
          title: "addColumnAfter",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addColumnAfter().run();
          },
        },
        {
          title: "deleteColumn",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).deleteColumn().run();
          },
        },
        {
          title: "addRowBefore",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addRowBefore().run();
          },
        },
        {
          title: "addRowAfter",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addRowAfter().run();
          },
        },
        {
          title: "deleteRow",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).deleteRow().run();
          },
        },
        {
          title: "deleteTable",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).deleteTable().run();
          },
        },
        {
          title: "bold",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setMark("bold").run();
          },
        },
        {
          title: "italic",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setMark("italic").run();
          },
        },
        {
          title: "strike",
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setMark("strike").run();
          },
        },
        {
          title: "img",
          type: "common",
          command: ({ editor, range, props }) => {
            console.log(props.props.url);
            if (props.props.index) {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "image",
                  attrs: { src: props.props.url },
                })
                .run();
            } else {
              if (props.props.type) {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertContent({
                    type: "image",
                    attrs: { src: props.props.url },
                  })
                  .run();
              } else {
                let img = new Image(); //手动创建一个Image对象
                img.src = props.props.url;
                console.log(props.props.url);
                img.onload = async () => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .insertContent({
                      type: "image",
                      attrs: { src: props.props.url },
                    })
                    .run();
                };
              }
            }
          },
        },
      ].filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      );
    }
    return [
      {
        title: "H1",
        type: "common",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 2 })
            .run();
        },
      },
      {
        title: "H2",
        type: "common",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 3 })
            .run();
        },
      },
      {
        title: "H3",
        type: "common",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 4 })
            .run();
        },
      },
      {
        title: "img",
        type: "common",
        command: ({ editor, range, props }) => {
          if (props.props.index) {
            editor
              .chain()
              .focus()
              .insertContent({
                type: "image",
                attrs: { src: props.props.url },
              })
              .run();
          } else {
            if (props.props.type) {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent({
                  type: "image",
                  attrs: { src: props.props.url },
                })
                .run();
            } else {
              editor
                .chain()
                .focus()
                .setImage({
                  src: props.props.url,
                })
                .run();
            }
          }
        },
      },
      {
        title: "bulletList",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "orderedList",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "taskList",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      {
        title: "code",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark("code").run();
        },
      },
      {
        title: "codeblock",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
        },
      },
      {
        title: "horizontalRule",
        type: "common",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: "table",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            // 在表格后插入一行
            .insertContent({
              type: "paragraph",
            })
            .setTextSelection(range)
            .insertTable({ rows: 4, cols: 3, withHeaderRow: true })
            .run();
        },
      },
    ].filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );
    // .slice(0, 10);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new VueRenderer(SlashList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
