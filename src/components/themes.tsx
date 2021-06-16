import themeLibrary from './themeLibrary';
import frontMatter from 'front-matter';

export default function themes() {
  return {
    viewerEffect({ file }: any) {
      if (file.frontmatter) {
        const frontmatter = file.frontmatter.theme;
        const editorStyle = document.createElement('style');
        // @ts-ignore
        editorStyle.innerHTML = themeLibrary?.[frontmatter] ?? '';
        document.head.appendChild(editorStyle);
        return () => {
          editorStyle && editorStyle.remove();
        };
      }
    },
    actions: [
      {
        title: '主题',
        icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M335.744 833.28h352.512V460.288l-14.08-14.464 65.28-67.008 77.312 79.36 76.8-78.848L709.76 190.72h-65.6c-21.056 54.336-72.128 93.056-132.16 94.72-60.032-1.728-111.04-40.448-132.224-94.72h-65.6L130.56 379.392l76.8 78.784 77.12-79.296 65.28 67.008-14.08 14.464v372.864zM780.608 928H243.392V555.136l-36.032 36.992-64.832-66.56L0 379.52 275.84 96h137.536c45.504 0 48.896 52.096 50.048 53.12A55.04 55.04 0 0 0 512 190.592a55.04 55.04 0 0 0 48.576-41.472c1.152-1.024 4.544-53.12 50.048-53.12h137.6L1024 379.264 881.6 525.632l-64.96 66.496-36.032-36.992V928z" fill="#333"/></svg>',
        handler: {
          type: 'dropdown',
          actions: Object.keys(themeLibrary).map((themeName) => ({
            title: themeName,
            handler: {
              type: 'action',
              click({ editor }: any) {
                let frontmatter = `---\n theme: ${themeName} \n---\n\n`;
                const { body } = frontMatter(editor.getValue());
                editor.setValue(frontmatter + body);
                editor.focus();
              },
            },
          })),
        },
      },
    ],
  };
}
