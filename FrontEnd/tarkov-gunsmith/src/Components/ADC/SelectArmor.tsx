import { useEffect, useState } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import Select from 'react-select'
import { MaterialType, ArmorOption } from './ArmorData';

export default function SelectArmor(props: any) {
    const [item, setItem] = useState<ArmorOption>();

    const handleClick = (selectedOption: any) => {
        setItem(selectedOption)
        props.handleArmorSelection(selectedOption, selectedOption.maxDurability)

        //! Navigate needs to be passed in as a prop from the parent.
        //? We will do this as part of handleArmorSelection.
    }
    // This useEffect sets the item according to the URL param ID if there is one
    useEffect(() => {
        //console.log("props.defaultSelection", props.defaultSelection)
        if (props.defaultSelection!) {
            setItem(props.defaultSelection)
        }
    }, [props.defaultSelection])
    
    return (
        <>
            <div className='black-text'>
                <Select
                    value={item}
                    required
                    placeholder="Select your armor..."
                    className="selectorZIndexBodge"
                    classNamePrefix="select"
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
                                    <span style={{ minWidth: "55px" }}>🛡 AC: {option.armorClass}</span>
                                    <span style={{ minWidth: "90px" }}>🔧 DUR: {option.maxDurability}</span>
                                    <span style={{ minWidth: "165px" }}>🧱 MAT: {MaterialType[option.armorMaterial]}</span>
                                    <span style={{ minWidth: "65px" }}>⚖ E.DURA: {option.effectiveDurability}</span>

                                </Stack>
                                <span>👨‍🔧 TRDR:{option.traderLevel}</span>
                            </Col>
                        </Row>
                    )}
                    onChange={handleClick}
                />
            </div>
        </>
    )
}