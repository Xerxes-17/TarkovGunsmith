import { useState, useEffect, useRef } from "react";
import { getPresets, savePreset, deletePreset, overwritePreset, BallisticPreset } from "../presets";
import { Button, TextInput, Group, Stack, Text, ActionIcon, Drawer, Divider, Popover } from "@mantine/core";
import { IconTrash, IconEdit, IconUpload, IconFolder } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";
import { BallisticFormState } from "../presets";

export function PresetManager({
    onLoad,
    getCurrentState,
}: {
    onLoad: (data: BallisticFormState) => void;
    getCurrentState: () => BallisticFormState;

}) {
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [presets, setPresets] = useState<BallisticPreset[]>([]);
    const [presetName, setPresetName] = useState("");
    const [nameError, setNameError] = useState("");
    const [newName, setNewName] = useState("");
    const [newNameError, setNewNameError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [renamingPresetId, setRenamingPresetId] = useState<string | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    useEffect(() => {
        setPresets(getPresets());
    }, []);

    const validateName = (name: string, currentId?: string) => {
        if (!name.trim()) return "Preset name is required!";
        if (presets.some(p => p.name === name.trim() && p.id !== currentId)) {
            return "Preset name already exists!";
        }
        return "";
    };

    const handleSave = () => {
        const error = validateName(presetName);
        if (error) {
            setNameError(error);
            return;
        }

        try {
            const currentState = getCurrentState();
            const newPreset: BallisticPreset = {
                id: uuidv4(),
                name: presetName.trim(),
                data: currentState,
                createdAt: new Date().toISOString(),
            };

            savePreset(newPreset);
            setPresets(getPresets());
            setPresetName("");
            setNameError("");

        } catch (error: any) {
            setNameError(error.message || "Failed to save preset");
        }
    };

    const handleLoad = (preset: BallisticPreset) => {
        onLoad(preset.data);
        setDrawerOpened(false);
    };

    const handleDelete = (id: string) => {
        setDeleteTargetId(id);
    };

    const confirmDelete = () => {
        if (!deleteTargetId) return;

        const preset = presets.find(p => p.id === deleteTargetId);
        if (!preset) return;

        deletePreset(preset.id);
        setPresets(getPresets());
        setDeleteTargetId(null);
    };

    const startRename = (preset: BallisticPreset) => {
        setRenamingPresetId(preset.id);
        setNewName(preset.name);
    };

    const handleRename = () => {
        if (!renamingPresetId) return;
        const preset = presets.find(p => p.id === renamingPresetId);
        if (!preset) return;

        const error = validateName(newName, renamingPresetId);
        if (error) {
            setNewNameError(error);
            return;
        }

        const updatedPreset = {
            ...preset,
            name: newName.trim()
        };

        overwritePreset(updatedPreset);
        setPresets(getPresets());
        setRenamingPresetId(null);
        setNewName("");
        setNewNameError("");
    };

    const handleExport = (preset: BallisticPreset) => {
        const dataStr = JSON.stringify(preset, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportFileName = `${preset.name.replace(/[^a-z0-9]/gi, '_')}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedPreset = JSON.parse(event.target?.result as string) as BallisticPreset;

                if (!importedPreset.name || !importedPreset.data) {
                    throw new Error("Invalid preset format");
                }

                const newPreset: BallisticPreset = {
                    ...importedPreset,
                    id: uuidv4(),
                    createdAt: new Date().toISOString()
                };

                savePreset(newPreset);
                setPresets(getPresets());

            } catch (error) {
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);

        e.target.value = "";
    };

    return (
        <>
            <Button
                leftIcon={<IconFolder size={16} />}
                variant="light"
                onClick={() => setDrawerOpened(true)}
            >
                Manage Presets
            </Button>


            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title="Preset Manager"
                padding="xl"
                size="xl"
                position="right"
            >
                <Stack spacing="xs">
                    <TextInput
                        label="Save Preset"
                        placeholder="Preset name"
                        value={presetName}
                        onChange={e => {
                            setPresetName(e.currentTarget.value);
                            if (nameError) setNameError("");
                        }}
                        onBlur={() => setNameError(validateName(presetName))}
                        required
                        error={nameError}
                    />
                    <Button
                        variant="light"
                        onClick={handleSave}
                        disabled={!presetName.trim()}
                    >
                        Save Current Preset
                    </Button>

                    <Divider my="sm" />

                    <Button
                        variant="outline"
                        leftIcon={<IconUpload size={16} />}
                        onClick={() => fileInputRef.current?.click()}
                        fullWidth
                    >
                        Import Preset
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".json"
                        onChange={handleFileImport}
                    />

                    <Divider my="sm" label="Saved Presets" labelPosition="center" />

                    {presets.length === 0 ? (
                        <Text size="sm" color="dimmed" mt="xs" align="center">No saved presets</Text>
                    ) : (
                        <Stack spacing={4}>
                            {presets.map(p => (
                                <Group key={p.id} position="apart" noWrap>
                                    <Button
                                        size="sm"
                                        fullWidth
                                        variant="subtle"
                                        onClick={() => handleLoad(p)}
                                        styles={{ inner: { justifyContent: 'flex-start' } }}
                                    >
                                        <Text truncate>{p.name}</Text>
                                    </Button>
                                    <Group noWrap spacing={4}>
                                        <Popover
                                            opened={renamingPresetId === p.id}
                                            onClose={() => setRenamingPresetId(null)}
                                            position="bottom"
                                            withArrow
                                        >
                                            <Popover.Target>
                                                <ActionIcon
                                                    color="blue"
                                                    onClick={() => startRename(p)}
                                                    title="Rename"
                                                >
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <TextInput
                                                    value={newName}
                                                    onChange={(e) => {
                                                        setNewName(e.currentTarget.value);
                                                        if (newNameError) setNewNameError("");
                                                    }}
                                                    onBlur={() => setNewNameError(validateName(newName, p.id))}
                                                    required
                                                    error={newNameError}
                                                    autoFocus
                                                />
                                                <Group position="right" mt="sm">
                                                    <Button
                                                        variant="default"
                                                        size="xs"
                                                        onClick={() => setRenamingPresetId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="xs"
                                                        onClick={handleRename}
                                                        disabled={!newName.trim()}
                                                    >
                                                        Save
                                                    </Button>
                                                </Group>
                                            </Popover.Dropdown>
                                        </Popover>

                                        <ActionIcon
                                            color="gray"
                                            onClick={() => handleExport(p)}
                                            title="Export"
                                        >
                                            <IconUpload size={16} />
                                        </ActionIcon>

                                        <Popover
                                            opened={deleteTargetId === p.id}
                                            onClose={() => setDeleteTargetId(null)}
                                            position="bottom"
                                            withArrow
                                        >
                                            <Popover.Target>
                                                <ActionIcon
                                                    color="red"
                                                    onClick={() => handleDelete(p.id)}
                                                    title="Delete"
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <Text size="sm">Delete preset "{p.name}"?</Text>
                                                <Group position="right" mt="sm">
                                                    <Button
                                                        variant="default"
                                                        size="xs"
                                                        onClick={() => setDeleteTargetId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        color="red"
                                                        size="xs"
                                                        onClick={confirmDelete}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Group>
                                            </Popover.Dropdown>
                                        </Popover>
                                    </Group>
                                </Group>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Drawer>
        </>
    );
}
