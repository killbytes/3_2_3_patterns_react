import { useEffect, useReducer } from 'react';
import { Container, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { Card } from '@/components/Card/Card';
import type { CardItem, LaunchesResponse } from '@/shared/types/CardItem';
import './App.scss';
import { Modal } from '@/components/Modal/Modal';

type State = {
    isLoading: boolean;
    data: CardItem[];
    error: string | null;
    selectedLaunch: CardItem | null;
    isModalOpen: boolean;
};

type Action =
    | { type: 'request' }
    | { type: 'success'; results: CardItem[] }
    | { type: 'failure'; error: string }
    | { type: 'openModal'; launch: CardItem }
    | { type: 'closeModal' }

const initialState: State = {
    isLoading: false,
    data: [],
    error: null,
    isModalOpen: false,
    selectedLaunch: null,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'request':
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case 'success':
            return {
                ...state,
                isLoading: false,
                data: action.results,
                error: null,
            };

        case 'failure':
            return {
                ...state,
                isLoading: false,
                data: [],
                error: action.error,
            };

        case 'openModal':
            return {
                ...state,
                isModalOpen: true,
                selectedLaunch: action.launch,
            };

        case 'closeModal':
            return {
                ...state,
                isModalOpen: false,
                selectedLaunch: null,
            };


        default:
            return state;
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState,);

    useEffect(() => {
        let ignore = false;

        const fetchLaunches = async () => {
            dispatch({ type: 'request' });

            try {
                const response = await fetch('https://kata-spacex.onrender.com/api/launches');

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const results: LaunchesResponse = await response.json();

                if (!ignore) {
                    dispatch({
                        type: 'success',
                        results: results.launches,
                    });
                }
            } catch (error) {
                if (!ignore) {
                    dispatch({
                        type: 'failure',
                        error: 'Something went wrong',
                    });
                }
            }
        };

        fetchLaunches();

        return () => {
            ignore = true;
        };
    }, []);


    const handleOpenModal = (launch: CardItem) => {
        dispatch({
            type: 'openModal',
            launch,
        });
    };

    const handleCloseModal = () => {
        dispatch({
            type: 'closeModal',
        });
    };

    if (state.isLoading) {
        return (
            <div className="app-loader">
                <Loader size="lg" data-testid="app-loader" />
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="app-error">
                <Text c="red">
                    Failed to load launches: {state.error}
                </Text>
            </div>
        );
    }

    return (
        <>
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
                    {state.data.map((launch) => (
                        <Card key={launch.flight_number} launch={launch} onSeeMore={handleOpenModal}/>
                    ))}
                </SimpleGrid>
            </Container>
            {state.isModalOpen && state.selectedLaunch && (
                <Modal onClose={handleCloseModal}>
                    <div className="launch-modal">
                        <img
                            src={state.selectedLaunch.links?.mission_patch ?? ''}
                            alt={state.selectedLaunch.mission_name}
                            className="launch-modal__image"
                        />

                        <div className='launch-modal__title'>
                            <Title order={5}>
                                Mission name:
                            </Title>
                            <Text size="xs" className='launch-modal__descr'>{state.selectedLaunch.mission_name}</Text>
                        </div>

                        <div className='launch-modal__title'>
                            <Title order={5}>
                                Rocket name:
                            </Title>
                            <Text size="xs" className='launch-modal__descr'>
                                {state.selectedLaunch.rocket?.rocket_name}
                            </Text>
                        </div>

                        {state.selectedLaunch.details && (
                            <div className='launch-modal__title'>
                                <Title order={5}>
                                    Details:
                                </Title>
                                <Text size="xs" className='launch-modal__descr'>
                                    {state.selectedLaunch.details}
                                </Text>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default App;