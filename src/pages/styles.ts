import styled from 'styled-components';

export const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const StyledMainWrapper = styled.main`
  display: flex;
  margin: 20px;
  flex: 1;

  & > div {
    flex: 1;

    & > .bytemd {
      height: 100%;
      border-radius: 6px;
      overflow: hidden;

      & .bytemd-tippy-right:last-child {
        display: none;
      }

      .markdown-body {
        border-left: 1px solid #e1e4e8;
        font-size: 14px;
        font-family: 'JetBrains Mono', sans-serif !important;
        color: #333;
        text-rendering: optimizeLegibility;
        line-height: 1.6rem;
        letter-spacing: 0;
        margin: 0;
        overflow-x: hidden;

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          position: relative;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: bold;
          line-height: 1.4;
          cursor: text;
          color: #273849;
        }

        h1 {
          font-size: 1.6rem;
          text-align: center;
          margin-top: 0;
        }

        h2 {
          font-size: 1.6rem;
          display: inline-block;
        }

        h2:after {
          display: block;
          content: '';
          height: 2px;
          margin-top: 4px;
          background-color: #273849;
          border-radius: 2px;
        }

        h3 {
          font-size: 1.4rem;
        }

        h4 {
          font-size: 1.2rem;
        }

        h5 {
          font-size: 1rem;
        }

        h6 {
          font-size: 1rem;
        }

        p,
        blockquote,
        ul,
        ol,
        dl,
        table {
          margin: 0.8em 0;
        }

        li > ol,
        li > ul {
          margin: 0 0;
        }

        hr {
          height: 2px;
          padding: 0;
          margin: 16px 0;
          background-color: #e7e7e7;
          border: 0 none;
          overflow: hidden;
          box-sizing: content-box;
        }

        h2:first-child {
          margin-top: 0;
          padding-top: 0;
        }

        h1:first-child {
          margin-top: 0;
          padding-top: 0;
        }

        h1:first-child + h2 {
          margin-top: 0;
          padding-top: 0;
        }

        h3:first-child,
        h4:first-child,
        h5:first-child,
        h6:first-child {
          margin-top: 0;
          padding-top: 0;
        }

        h1 p,
        h2 p,
        h3 p,
        h4 p,
        h5 p,
        h6 p {
          margin-top: 0;
        }

        li p.first {
          display: inline-block;
        }

        ul,
        ol {
          padding-left: 30px;
        }

        ul:first-child,
        ol:first-child {
          margin-top: 0;
        }

        ul:last-child,
        ol:last-child {
          margin-bottom: 0;
        }

        blockquote {
          color: #333333;
          border-radius: 2px;
          padding: 10px 16px;
          background-color: #fdefee;
          position: relative;
          border-left: none;
        }

        blockquote:before {
          display: block;
          position: absolute;
          content: '';
          width: 4px;
          left: 0;
          top: 0;
          height: 100%;
          background-color: #e95f59;
          border-radius: 2px;
        }

        blockquote > p {
          margin: 0;
        }

        table {
          padding: 0;
          word-break: initial;
        }

        table tr {
          border-top: 1px solid #dfe2e5;
          margin: 0;
          padding: 0;
        }

        table tr:nth-child(2n),
        thead {
          background-color: #fafafa;
        }

        table tr th {
          font-weight: bold;
          border: 1px solid #dfe2e5;
          border-bottom: 0;
          text-align: left;
          margin: 0;
          padding: 6px 13px;
        }

        table tr td {
          border: 1px solid #dfe2e5;
          text-align: left;
          margin: 0;
          padding: 6px 13px;
        }

        table tr th:first-child,
        table tr td:first-child {
          margin-top: 0;
        }

        table tr th:last-child,
        table tr td:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;
