import { useState, useEffect, useRef } from "react";
import { getPresets, savePreset, deletePreset, overwritePreset, BallisticPreset } from "../presets";
import { Button, TextInput, Group, Stack, Text, ActionIcon, Modal } from "@mantine/core";
import { IconTrash, IconEdit, IconUpload } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";
import { BallisticFormState } from "../presets";

export function PresetManager({
  onLoad,
  getCurrentState
}: {
  onLoad: (data: BallisticFormState) => void;
  getCurrentState: () => BallisticFormState;
}) {
  const [presets, setPresets] = useState<BallisticPreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [editingPreset, setEditingPreset] = useState<BallisticPreset | null>(null);
  const [newName, setNewName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPresets(getPresets());
  }, []);

  const handleSave = () => {
    if (!presetName.trim()) return alert("Preset name is required!");
    
    // Get current form state directly
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
  };

  const handleLoad = (preset: BallisticPreset) => {
    onLoad(preset.data);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this preset?")) {
      deletePreset(id);
      setPresets(getPresets());
    }
  };

  const startRename = (preset: BallisticPreset) => {
    setEditingPreset(preset);
    setNewName(preset.name);
  };

  const handleRename = () => {
    if (!editingPreset || !newName.trim()) return;

    const updatedPreset = {
      ...editingPreset,
      name: newName.trim()
    };

    overwritePreset(updatedPreset);
    setPresets(getPresets());
    setEditingPreset(null);
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
        alert(`Preset "${newPreset.name}" imported successfully!`);
      } catch (error) {
        console.error("Import error:", error);
        alert("Failed to import preset. Invalid file format.");
      }
    };
    reader.readAsText(file);

    e.target.value = "";
  };

  return (
    <Stack spacing="xs" mt="md" style={{ width: '100%' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileImport}
      />

      <TextInput
        label="Save Preset"
        placeholder="Preset name"
        value={presetName}
        onChange={e => setPresetName(e.currentTarget.value)}
        required
        error={!presetName.trim() ? "Name is required" : undefined}
      />
      <Group grow>
        <Button
          variant="light"
          onClick={handleSave}
          disabled={!presetName.trim()}
        >
          Save Current Preset
        </Button>
        <Button
          variant="outline"
          leftIcon={<IconUpload size={16} />}
          onClick={handleImportClick}
        >
          Import Preset
        </Button>
      </Group>

      <Text weight={500} size="sm" mt="sm">Saved Presets</Text>
      {presets.length === 0 ? (
        <Text size="sm" color="dimmed" mt="xs">No saved presets</Text>
      ) : (
        presets.map(p => (
          <Group key={p.id} position="apart" noWrap style={{ width: '100%' }}>
            <Button
              size="xs"
              fullWidth
              variant="subtle"
              onClick={() => handleLoad(p)}
            >
              <Text truncate title={p.name}>{p.name}</Text>
            </Button>
            <Group noWrap spacing={4}>
              <ActionIcon
                color="blue"
                onClick={() => startRename(p)}
                title="Rename"
              >
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon
                color="gray"
                onClick={() => handleExport(p)}
                title="Export"
              >
                <IconUpload size={16} />
              </ActionIcon>
              <ActionIcon
                color="red"
                onClick={() => handleDelete(p.id)}
                title="Delete"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>
        ))
      )}

      <Modal
        opened={!!editingPreset}
        onClose={() => setEditingPreset(null)}
        title="Rename Preset"
      >
        <TextInput
          label="New preset name"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
          required
          error={!newName.trim() ? "Name is required" : undefined}
        />
        <Group position="right" mt="md">
          <Button variant="default" onClick={() => setEditingPreset(null)}>
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            disabled={!newName.trim()}
          >
            Save
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}