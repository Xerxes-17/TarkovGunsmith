import { Col, Row, Stack } from 'react-bootstrap';
import Select from 'react-select'
import { MaterialType } from './ArmorData';

export default function SelectArmor(props: any) {

    const handleChange = (selectedOption: any) => {
        props.handleArmorSelection(selectedOption.value, selectedOption.maxDurability)
        //console.log(`Option selected:`, selectedOption);
    };

    return (
        <>
            <div className='black-text'>
                <Select 

                    required
                    placeholder="Select your armor..."
                    className="selectorZIndexBodge"
                    classNamePrefix="select"
                    // defaultValue={armorOptions[8]}
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
                    onChange={handleChange}
                />
            </div>
        </>
    )
}