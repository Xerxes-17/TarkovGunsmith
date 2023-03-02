import { useState } from "react";
import { Card, Col, Tab, Tabs } from "react-bootstrap";
import DataSheetAmmo from "./DataSheetAmmo";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DataSheetArmor from "./DataSheetArmor";


export default function DataSheetsBase(props: any) {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const [key, setKey] = useState('ammo');

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Col xxl>
                    <Card bg="dark" border="secondary" text="light" className="xxl">
                        <Card.Body>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={(k: any) => setKey(k)}
                                className="mb-3"
                                transition={false}
                            >
                                <Tab eventKey="ammo" title="Ammo">
                                    <DataSheetAmmo />
                                </Tab>
                                <Tab eventKey="armor" title="Armor">
                                    <DataSheetArmor />
                                </Tab>
                                <Tab eventKey="weapons" title="Weapons">
                                    Weapons coming soon!
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </ThemeProvider>
        </>
    )
}