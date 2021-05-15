import styled from 'styled-components';

export const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const StyledMainWrapper = styled.main`
  display: flex;
  margin: 20px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
  flex: 1;

  & > div {
    flex: 1;
  }
`;
