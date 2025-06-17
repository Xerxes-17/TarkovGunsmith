import { Container, Paper } from "@mantine/core";
import { SEO } from "../../Util/SEO";
import { TestForm } from "./test-form";
import { TestResults } from "./test-results";
import { useState } from "react";
import { TestFormValues } from "./test-form-context";


export function TestPage() {

    const [result, setResult] = useState<TestFormValues>();

    return (
        <>
            <SEO url="https://tarkovgunsmith.com/test_page" title={'Ballistic Calculator : Tarkov Gunsmith'} />
            <Container size={"99.5%"} px={0} pt={3}>
                <Paper shadow="sm" p={2} px={5} mt={0}>
                    This page will have a form and a results section. Nothing of interest to be found here<br/><br/>
                    <TestForm setResult={setResult}/>

                    <TestResults result={result}/>
                </Paper>
            </Container>
        </>
    )
}