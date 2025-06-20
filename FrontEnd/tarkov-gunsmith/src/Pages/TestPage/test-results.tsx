import { Divider, Stack, Text } from "@mantine/core";
import { TestFormValues } from "./test-form-context";

export function TestResults({ result }: { result: TestFormValues | undefined }) {
    return (
        <>
            {result && (
                <Stack spacing={"xs"} w={400}>
                    <Divider label="Results" labelPosition="center" />
                    <Text>When you clicked submit, you had a string of "{result.stringField}" and a number of "{result.distance}".</Text>
                </Stack>
            )}
            {!result && (
                <Stack spacing={"xs"} w={400}>
                    <Divider label="Results" labelPosition="center" />
                    <Text>No result provided yet.</Text>
                </Stack>
            )}
        </>
    )
}