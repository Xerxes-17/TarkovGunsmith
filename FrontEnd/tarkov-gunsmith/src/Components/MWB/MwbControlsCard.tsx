import { Button, Form, Spinner, Stack, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import {
    Button as ManButton,
    Card as ManCard,
    Slider, 
    Group,
    Text, Divider, Input, Flex, NumberInput, SegmentedControl,
    Select as ManSelect,
    Avatar,
    Grid,
} from '@mantine/core';

import { MwbContext } from "../../Context/ContextMWB";
import React, { forwardRef, useContext } from 'react';

import { OfferType } from '../AEC/AEC_Interfaces';



import InfoModalButton from './InfoModalButton';
import { getEnumKeyByValue } from '../Common/helpers';

const marks = [
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
];

export default function MwbControlsCard() {
    const {
        searchValue,
        playerLevel,
        weaponOptions,
        purchaseOfferTypes,
        filteredWeaponOptions,
        chosenGun,
        praporLevel,
        skierLevel,
        mechanicLevel,
        peacekeeperLevel,
        jaegerLevel,
        muzzleModeToggle,
        fittingPriority,
        setSearchValue,
        handleMDMChange,
        handleFPChange,
        handlePOTChange,
        handleSubmit,
        handlePlayerLevelChange,
        handleWeaponSelectionChange,
    } = useContext(MwbContext);

    interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
        imageLink: string;
        label: string;
        description: string;
        priceRUB: number;
        offerType: number
    }

    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ imageLink, label, description, priceRUB, offerType, ...others }: ItemProps, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={imageLink} />

                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            {getEnumKeyByValue(OfferType, offerType)} ₽ {priceRUB.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );

    return(
        <ManCard shadow="sm" padding="md" radius="md" withBorder bg={"#212529"} style={{ overflow: "auto" }}>
            <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <Stack direction="horizontal" gap={3}>
                    <h2>Modded Weapon Builder</h2>
                    <div className="ms-auto">
                        <InfoModalButton/>
                    </div>
                </Stack>

                <ManCard.Section>
                    <Divider size="sm" />
                </ManCard.Section>

                <Grid columns={48}>

                    <Grid.Col xl={26} lg={26} md={48} >
                        <Input.Wrapper id={"test"} label="Player Level - Changes access to purchase offers">
                            <Flex
                                gap="sm"
                                direction="row"
                            >
                                <Slider
                                    w={"100%"}
                                    py={5}
                                    marks={marks}
                                    value={playerLevel}
                                    min={1}
                                    max={40}
                                    step={1}
                                    label={(value) => value.toFixed(0)}
                                    onChange={handlePlayerLevelChange}
                                    onChangeEnd={handlePlayerLevelChange}
                                />
                                <NumberInput
                                    maw={70}
                                    miw={70}
                                    value={playerLevel}
                                    min={1}
                                    max={40}
                                    onChange={handlePlayerLevelChange}
                                />
                            </Flex>
                        </Input.Wrapper>

                    </Grid.Col>

                    <Grid.Col xl={22} lg={22} md={48}>
                        <Form.Text>Trader Levels</Form.Text><br />
                        <Stack direction="horizontal" gap={2} style={{ flexWrap: "wrap" }}>
                            <Button disabled size="sm" variant="outline-info">
                                <Stack direction="horizontal" gap={2} >
                                    {praporLevel}
                                    <div className="vr" />
                                    Prapor
                                </Stack>
                            </Button>
                            <Button disabled size="sm" variant="outline-info">
                                <Stack direction="horizontal" gap={2}>
                                    {skierLevel}
                                    <div className="vr" />
                                    Skier
                                </Stack>
                            </Button>
                            <Button disabled size="sm" variant="outline-info">
                                <Stack direction="horizontal" gap={2}>
                                    {mechanicLevel}
                                    <div className="vr" />
                                    Mechanic
                                </Stack>
                            </Button>
                            <Button disabled size="sm" variant="outline-info">
                                <Stack direction="horizontal" gap={2}>
                                    {peacekeeperLevel}
                                    <div className="vr" />
                                    Peacekeeper
                                </Stack>
                            </Button>
                            <Button disabled size="sm" variant="outline-info">
                                <Stack direction="horizontal" gap={2}>
                                    {jaegerLevel}
                                    <div className="vr" />
                                    Jaeger
                                </Stack>
                            </Button>
                        </Stack>

                    </Grid.Col>

                    <Grid.Col xl={26} lg={26} md={33} span={48}>
                        <Group>
                            <Input.Wrapper id={"test1"} label="Muzzle Device Mode" description="Any will choose from both loud + silenced." inputWrapperOrder={['label', 'input', 'description', 'error']} >
                                <br />
                                <SegmentedControl
                                    value={muzzleModeToggle}
                                    onChange={handleMDMChange}
                                    fullWidth
                                    color="blue"
                                    id="test1"
                                    data={[
                                        { label: 'Loud', value: 'Loud' },
                                        { label: 'Silenced', value: 'Quiet' },
                                        { label: 'Any', value: 'Any' },
                                    ]}
                                />
                            </Input.Wrapper>
                            <Input.Wrapper id={"test2"} label="Fitting Priority" description="Meta: Filter to best of X, then best of Y." inputWrapperOrder={['label', 'input', 'description', 'error']}>
                                <br />
                                <SegmentedControl
                                    style={{ whiteSpace: "normal", height: "100%" }}
                                    value={fittingPriority}
                                    onChange={handleFPChange}
                                    color="blue"
                                    id="test2"
                                    data={[
                                        { label: 'Recoil', value: 'Recoil' },
                                        { label: 'Meta Recoil', value: 'MetaRecoil' },
                                        { label: 'Ergonomics', value: 'Ergonomics' },
                                        { label: 'Meta Ergonomics', value: 'MetaErgonomics' },
                                    ]}
                                />
                            </Input.Wrapper>
                        </Group>
                    </Grid.Col>

                    <Grid.Col xl={9} lg={9} md={11} span={48}>
                        <Input.Wrapper id={"test3"} label="Weapon Purchase Offer Filter" description="Must choose at least one" inputWrapperOrder={['label', 'input', 'description', 'error']}>
                            <br />
                            <ToggleButtonGroup type="checkbox" name="PurchaseOfferTypes" value={purchaseOfferTypes} onChange={(val) => {
                                handlePOTChange(val)
                            }} >
                                <ToggleButton variant="outline-warning" id="tbg-radio-PO_Cash" value={OfferType.Cash}>
                                    Cash
                                </ToggleButton>
                                <ToggleButton variant="outline-warning" id="tbg-radio-PO_Barter" value={OfferType.Barter}>
                                    Barter
                                </ToggleButton>
                                <ToggleButton variant="outline-warning" id="tbg-radio-PO_Flea" value={OfferType.Flea}>
                                    Flea
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Input.Wrapper>

                    </Grid.Col>

                    <Grid.Col span={48}>

                        {weaponOptions.length === 0 && (
                            <>
                                <div className="d-grid gap-2">
                                    <Button size="lg" variant="secondary" disabled>
                                        <Stack direction="horizontal" gap={2}>
                                            <Spinner animation="border" role="status">
                                            </Spinner>
                                            <div className="vr" />
                                            Getting weapon options...
                                        </Stack>
                                    </Button>
                                </div>
                            </>
                        )}
                        {weaponOptions.length > 0 && (
                            <ManSelect
                                value={chosenGun}
                                onChange={handleWeaponSelectionChange}
                                withinPortal
                                label={<Text fz="sm">Available Choices: {filteredWeaponOptions.length} </Text>}
                                placeholder="Select your weapon..."
                                itemComponent={SelectItem}
                                data={filteredWeaponOptions}
                                maxDropdownHeight={400}
                                required
                                withAsterisk={false}

                                searchable
                                onSearchChange={setSearchValue}
                                searchValue={searchValue}
                                nothingFound="No weapons found."
                            />
                        )}
                    </Grid.Col>

                </Grid>
                <ManButton variant="filled" color="teal" fullWidth mt="md" radius="md" uppercase type="submit">
                    Build
                </ManButton>
            </Form>
        </ManCard>

    )
}