import { Col, Row, Stack } from 'react-bootstrap';
import Select from 'react-select'
import { ammoOptions } from './AmmoData';



export default function SelectAmmo(props: any) {

    const handleChange = (selectedOption: any) => {
        props.handleAmmoSelection(selectedOption.label)
        console.log(`Option selected:`, selectedOption);
    };

    return (
        <>
            <div className='black-text'>
                <Select
                    placeholder="Select your ammo..."
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={ammoOptions[29]}
                    isClearable={true}
                    isSearchable={true}
                    name="selectAmmo"
                    options={props.ammoOptions}
                    formatOptionLabel={option => (
                        <Row>
                            <Stack className="armor-option" direction="horizontal" gap={1}>
                                <Col xs="5">
                                    <Stack className="armor-option" direction="horizontal" gap={3}>
                                        <img src={option.imageLink} alt={option.label} />
                                        <span>{option.label}</span>
                                    </Stack>
                                </Col>
                                <Col>
                                    <span>{option.caliber}</span>
                                </Col>
                                <Col xs="5">
                                    <Stack direction="horizontal" gap={5}>
                                        <span>✒{option.penetrationPower}</span>
                                        <span>📐{option.armorDamagePerc}%</span>
                                        <span>💀{option.damage}</span>
                                        <span>👨‍🔧{option.traderLevel}</span>
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