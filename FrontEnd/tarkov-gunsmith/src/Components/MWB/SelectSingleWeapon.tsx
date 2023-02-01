import { Col, Container, Row, Stack } from 'react-bootstrap';
import Select from 'react-select'
import { StockWeaponOptions } from './WeaponData';

export default function SelectSingleWeapon(props: any) {

    const handleChange = (selectedOption: any) => {
        props.handleWeaponSelection(selectedOption.value)
        console.log(`Option selected:`, selectedOption);
    };

    return (
        <>
            <div className='black-text'>
                <Select
                    placeholder="Select your weapon..."
                    className="basic-single"
                    classNamePrefix="select"
                    
                    isClearable={true}
                    isSearchable={true}
                    name="SelectWeapon"
                    options={props.weaponOptions}
                    formatOptionLabel={option => (

                        <Container>
                            <Row>
                                <Col>
                                    <img src={option.imageLink} alt={option.label} className={"weapon_image"} />
                                </Col>
                                <Col>
                                    <span>{option.label}</span>
                                </Col>
                            </Row>
                        </Container>
                    )}
                    onChange={handleChange}
                />
            </div>
        </>
    )
}