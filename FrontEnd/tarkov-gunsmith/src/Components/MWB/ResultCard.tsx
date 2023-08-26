import { useContext } from 'react';
import { MwbContext } from '../../Context/ContextMWB';
import { Box, Card, Divider, Grid, Group, Image } from '@mantine/core';
import MainStatsLine from './MainStatsLine';
import MarketInfoCard from './MarketInfoCard';
import AttachedModsList from './AttachedModsList';
import ExcludedModsList from './ExcludedModsList';
import AmmoInfoCard from './MarketInfoCard';

export default function ResultCard() {
    const {
        result,
        excludedMods
    } = useContext(MwbContext);

    if (result !== undefined)
        return (
            <>
            <Card className='MWBresultCard' id='MWVBprintID'>
                <Group noWrap>
                    <h2 className='MWBresultCardTitle'>{result.BasePreset!.Weapon!.Name}</h2>
                    {/* Disabled for now due to cors being a bitch */}
                    {/* <div className="ms-auto">
                        <Stack direction='horizontal' gap={2}>
                            <Button size='sm' variant="outline-info" onClick={() => handleImageDownload('MWVBprintID')}>Download 📩</Button>
                            <Button size='sm' variant="outline-info" onClick={() => handleCopyImage('MWVBprintID')}>Copy 📋</Button>
                        </Stack>
                    </div> */}
                </Group>
                <Card.Section>
                    <Divider size="sm" />
                </Card.Section>
                <Grid columns={48} pt={4}>
                    <Grid.Col xl={12} lg={12} md={12} span={48}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                src={`https://assets.tarkov.dev/${result?.BasePreset?.Id.split("_")[0]}-grid-image.webp`}
                                alt="avatar"
                                // mah={105}
                                maw={305}
                                fit="scale-down"
                                withPlaceholder
                            />
                        </Box>
                    </Grid.Col>
                    <Grid.Col xl={36} lg={36} md={36} span={48}>
                        <MainStatsLine />
                    </Grid.Col>
                </Grid>


                <Grid columns={48}>
                    <Grid.Col xl={12} lg={12} md={12} span={48}>
                        <MarketInfoCard />
                        <AmmoInfoCard/>
                    </Grid.Col>
                    <Grid.Col xl={36} lg={36} md={36} span={48}>
                        <AttachedModsList />
                        {excludedMods !== undefined && excludedMods?.length > 0 && (
                            <ExcludedModsList />
                        )}

                    </Grid.Col>
                </Grid>

            </Card>
        </>
        )
    else return <></>
}