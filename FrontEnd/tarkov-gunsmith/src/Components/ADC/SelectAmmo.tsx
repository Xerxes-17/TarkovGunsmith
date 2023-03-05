import { Col, Row, Stack } from 'react-bootstrap';
import Select from 'react-select'

export default function SelectAmmo(props: any) {

    const handleChange = (selectedOption: any) => {
        props.handleAmmoSelection(selectedOption.value)
        // console.log(`Option selected:`, selectedOption);
    };

    return (
        <>
            <div className='black-text'>
                <Select
                    required
                    placeholder="Select your ammo..."
                    className="selectorZIndexBodge"
                    classNamePrefix="select"
                    // defaultValue={ammoOptions[29]}
                    isClearable={true}
                    isSearchable={true}
                    name="selectAmmo"
                    options={props.ammoOptions}
                    formatOptionLabel={option => (
                        <Row>
                            <Col style={{ maxWidth: "75px" }}>
                                <img src={option.imageLink} alt={option.label} />
                            </Col>
                            <Col>
                                <span>{option.label}</span>
                                <Stack direction='horizontal' gap={1} style={{ flexWrap: "wrap" }}>
                                    <span style={{ minWidth: "55px" }}>⛏ PEN: {option.penetrationPower}</span>
                                    <span style={{ minWidth: "55px" }}>📏 AD%: {option.armorDamagePerc}</span>
                                    <span style={{ minWidth: "55px" }}>💀 DAM: {option.damage}</span>
                                    <span>👨‍🔧 TRDR:{option.traderLevel} </span>
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