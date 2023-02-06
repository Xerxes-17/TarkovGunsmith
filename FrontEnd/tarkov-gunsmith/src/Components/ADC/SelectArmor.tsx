import React, { useState } from 'react'
import { Col, Row, Stack, Table } from 'react-bootstrap';
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
                    isClearable={false}
                    isSearchable={true}
                    name="selectArmor"
                    options={props.armorOptions}
                    formatOptionLabel={option => (
                        <Row>
                            <Col style={{ maxWidth: "75px" }}>
                                <img src={option.imageLink} alt={option.label} />
                            </Col>
                            <Col>
                                <span>{option.label}</span>
                                <Stack direction='horizontal' gap={1} style={{ flexWrap: "wrap" }}>
                                    <span>🛡: {option.armorClass}</span>
                                    <span style={{ minWidth: "55px" }}>⛓: {option.maxDurability}</span>
                                    <span style={{ minWidth: "130px" }}>🧱: {MaterialType[option.armorMaterial]}</span>
                                    <span style={{ minWidth: "55px" }}>⚖: {option.effectiveDurability}</span>
                                    <span>👨‍🔧:{option.traderLevel}</span>
                                </Stack>
                            </Col>
                        </Row>
                    )}
                    onChange={handleChange}
                />
            </div>
        </>
    )
}