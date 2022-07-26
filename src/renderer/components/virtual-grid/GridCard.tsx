import { Card } from '@mantine/core';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { CardRow } from 'renderer/types';
import { Text } from '../text/Text';
import { GridCardControls } from './GridCardControls';

const CardWrapper = styled(motion.div)<{
  itemGap: number;
  itemHeight: number;
  itemWidth: number;
}>`
  display: flex;
  flex: ${({ itemWidth }) => `0 0 ${itemWidth}px`};
  width: ${({ itemWidth }) => `${itemWidth}px`};
  height: ${({ itemHeight }) => `${itemHeight}px`};
  margin: ${({ itemGap }) => `0 ${itemGap / 2}px`};
  border-radius: 3px;
  filter: drop-shadow(0 4px 4px #000);
  user-select: none;
  pointer-events: auto; // https://github.com/bvaughn/react-window/issues/128#issuecomment-460166682

  &:focus-visible {
    outline: 1px solid #fff;
  }
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: rgb(50, 50, 50, 50%);
  border-radius: 3px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgb(50, 50, 50, 60%);
  }
`;

const ImageSection = styled.div`
  width: 100%;
  height: 100%;
`;

const Image = styled(motion.div)<{ height: number; src: string }>`
  height: ${({ height }) => `${height}px`};
  background: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: cover;
  border: 0;
`;

const ControlsContainer = styled.div`
  display: none;
  width: 100%;
  height: 100%;

  ${StyledCard}:hover & {
    display: block;
  }
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  height: 25px;
  padding: 0 0.2rem;
`;

export const GridCard = ({ data, index, style, isScrolling }: any) => {
  const {
    itemHeight,
    itemWidth,
    columnCount,
    itemGap,
    itemCount,
    cardControls,
    cardRows,
    itemData,
    handlePlayQueueAdd,
  } = data;

  const startIndex = index * columnCount;
  const stopIndex = Math.min(itemCount - 1, startIndex + columnCount - 1);
  const cards = [];

  for (let i = startIndex; i <= stopIndex; i += 1) {
    cards.push(
      <CardWrapper
        key={`card-${i}-${index}`}
        itemGap={itemGap}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        tabIndex={0}
      >
        <StyledCard>
          <ImageSection>
            <Image
              animate={{
                opacity: 1,
              }}
              height={itemWidth}
              initial={{
                opacity: 0,
              }}
              src={itemData[i]?.image}
              transition={{
                duration: 0.5,
                ease: 'anticipate',
              }}
            >
              {!isScrolling && (
                <ControlsContainer>
                  <GridCardControls
                    cardControls={cardControls}
                    handlePlayQueueAdd={handlePlayQueueAdd}
                    itemData={itemData[i]}
                  />
                </ControlsContainer>
              )}
            </Image>
          </ImageSection>
          <DetailSection>
            {cardRows.map((row: CardRow) => (
              <Row key={`row-${row.prop}`}>
                <Text overflow="hidden" weight={500}>
                  {itemData[i] && itemData[i][row.prop]}
                </Text>
              </Row>
            ))}
          </DetailSection>
        </StyledCard>
      </CardWrapper>
    );
  }

  return (
    <div
      style={{
        ...style,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'start',
      }}
    >
      {cards}
    </div>
  );
};
