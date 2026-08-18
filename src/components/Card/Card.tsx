import {Button, Card as MantineCard, Image, Text} from '@mantine/core';
import type {CardItem} from '@/shared/types/CardItem';
import styles from './Card.module.scss';

type CardProps = {
    launch: CardItem;
    onSeeMore: (launch: CardItem) => void;
};

export const Card = ({launch, onSeeMore}: CardProps ) => {
    return (
        <MantineCard
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            className={styles.card}
        >
            <Image
                src={launch.links?.mission_patch}
                alt={launch.mission_name}
                className={styles.image}
            />

            <div className={styles.content}>
                <Text
                    size="lg"
                    fw={400}
                    className={styles.missionName}
                >
                    {launch.mission_name}
                </Text>

                <Text
                    size="md"
                    c="dimmed"
                    className={styles.rocketName}
                >
                    {launch.rocket?.rocket_name}
                </Text>
            </div>

            <Button
                fullWidth
                size="md"
                className={styles.button}
                onClick={() => onSeeMore(launch)}
            >
                See more
            </Button>
        </MantineCard>
    );
};