import React, { useState } from 'react'
import { Col, Row, Stack } from 'react-bootstrap';
import Select from 'react-select'
import { armorOptions, ArmorOption, MaterialType } from './ArmorData';


export default function SelectArmor(props: any) {

    const handleChange = (selectedOption: any) => {
        //handleArmorSelection(name: string, maxDurability: number)
        props.handleArmorSelection(selectedOption.label, selectedOption.maxDurability)
        console.log(`Option selected:`, selectedOption);
    };

    return (
        <>
            <div className='black-text'>
                <Select
                    placeholder="Select your armor..."
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={armorOptions[8]}
                    isClearable={true}
                    isSearchable={true}
                    name="selectArmor"
                    options={props.armorOptions}
                    formatOptionLabel={option => (
                        <Row>
                            <Stack className="armor-option" direction="horizontal" gap={2}>
                                <Col xs="7">
                                    <Stack className="armor-option" direction="horizontal" gap={3}>
                                        <img src={option.imageLink} alt={option.label} />
                                        <span>{option.label}</span>
                                    </Stack>
                                </Col>
                                <Col xs="3">
                                    <Stack direction="horizontal" gap={2}>
                                        <Col xs="3">
                                            <span>🛡: {option.armorClass}</span>
                                            <br/>
                                            <span>⛓: {option.maxDurability}</span>
                                        </Col>
                                        <Col xs="9">
                                            <span>🧱: {MaterialType[option.armorMaterial]}</span>
                                            <br/>
                                            <span>⚖: {option.effectiveDurability}</span>
                                        </Col>
                                        <Col xs="6">
                                            
                                            <span>👨‍🔧: {option.traderLevel}</span>
                                        </Col>
                                    </Stack>
                                </Col>
                            </Stack>
                        </Row>

                    )}
                    onChange={handleChange}
                />
            </div>
        </>
    )
}