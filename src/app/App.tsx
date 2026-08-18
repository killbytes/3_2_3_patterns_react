import { useEffect, useState } from 'react';
import { Container, Loader, SimpleGrid, Text, Title } from '@mantine/core';

import { Card } from '@/components/Card/Card';
import type { CardItem, LaunchesResponse } from '@/shared/types/CardItem';

import './App.scss';

const API_URL = 'https://kata-spacex.onrender.com/api/launches';

function App() {
    const [launches, setLaunches] = useState<CardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLaunches = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data: LaunchesResponse = await response.json();

                console.log(data)

                setLaunches(data.launches);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Something went wrong',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLaunches();
    }, []);

    if (loading) {
        return (
            <div className="app-loader">
                <Loader size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-error">
                <Text c="red">
                    Failed to load launches: {error}
                </Text>
            </div>
        );
    }

    return (
        <Container size="lg" className="app">
            <Title order={1} className="app__title">
                SpaceX Launches 2020
            </Title>

            <SimpleGrid
                cols={{
                    base: 1,
                    sm: 2,
                    md: 3,
                }}
                spacing="lg"
            >
                {launches.map((launch) => (
                    <Card key={launch.flight_number} launch={launch}/>
                ))}
            </SimpleGrid>
        </Container>
    );
}

export default App;