import { Button, Divider, Input, NumberInput, Stack } from "@mantine/core"
import { TestFormContextProvider, TestFormValues, testFormYupValidator, useTestForm } from "./test-form-context"


export function TestForm({setResult}:{setResult: React.Dispatch<React.SetStateAction<TestFormValues | undefined>>}) {

    const form = useTestForm({
        initialValues: {
            stringField: "springField",
            numberField: 1
        },
        validate: testFormYupValidator
    })

    function onClickSubmitForm() {
        const validation = form.validate();
        if(validation.hasErrors){
            return
        }
        setResult(form.values)
    }


    return (
        <>
            <TestFormContextProvider form={form}>
                <Stack spacing={"xs"} w={400}>
                    <Divider label="The Form!" labelPosition="center" />
                    <Input
                        {...form.getInputProps("stringField")}
                    />
                    <NumberInput
                        {...form.getInputProps("numberField")}
                    />
                    <Button
                        onClick={onClickSubmitForm}
                    >
                        Submit Form
                    </Button>
                </Stack>
            </TestFormContextProvider>

        </>
    )
}