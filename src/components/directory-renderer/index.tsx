import { useState, useCallback } from "react";
import FolderIcon from "../../components/icons/folder-icon";
export interface directoryManager {
  id: string;
  name: string;
  children: directoryManager[];
  layerIndex: number;
}

interface DirectoryRendererProps {
  directory: directoryManager;
  onEnterHandler: (dir: directoryManager) => void;
}

const DirectoryRenderer: React.FC<DirectoryRendererProps> = ({
  directory,
  onEnterHandler,
}) => {
  const [directoryTreeObject, setDirectoryTreeObject] = useState(directory);
  const [isEditing, setIsEditing] = useState(directory.name === "");
  const [inputValue, setInputValue] = useState("");

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const isValid = e.currentTarget.checkValidity();
        if (isValid && inputValue.trim() !== "") {
          if (
            directoryTreeObject.children.some(
              (child) => child.name === inputValue.trim()
            )
          ) {
            alert("It's duplicate name!");
            return;
          }

          setDirectoryTreeObject({
            ...directoryTreeObject,
            name: inputValue.trim(),
          });

          setIsEditing(false);
        } else {
          alert("Please enter a folder name");
        }
      }
    },
    [directoryTreeObject, inputValue]
  );

  const addChild = () => {
    const newChild = {
      id: crypto.randomUUID(),
      name: "",
      children: [],
      layerIndex: directoryTreeObject.layerIndex + 1,
    };

    setDirectoryTreeObject({
      ...directoryTreeObject,
      children: [...directoryTreeObject.children, newChild],
    });
  };

  const removeSelf = () => {
    onEnterHandler({ ...directoryTreeObject, name: "__REMOVE__" });
  };

  return (
    <div style={{ marginLeft: directoryTreeObject.layerIndex * 20 }}>
      {isEditing ? (
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onEnter}
        />
      ) : (
        <div style={{
            display:'flex',
            gap:'0.25rem'
        }}>
        <div style={{
            width:'1rem'
        }}><FolderIcon /></div>
          <span>{directoryTreeObject.name}</span>
          <button onClick={addChild}>Add</button>
          {directoryTreeObject.layerIndex > 0 && (
            <button onClick={removeSelf}>Remove</button>
          )}
        </div>
      )}
      {directoryTreeObject.children.map((child) => (
        <DirectoryRenderer
          key={child.id}
          directory={child}
          onEnterHandler={(updatedChild) => {
            if (updatedChild.name === "__REMOVE__") {
              setDirectoryTreeObject({
                ...directoryTreeObject,
                children: directoryTreeObject.children.filter(
                  (c) => c.id !== child.id
                ),
              });
            } else {
              setDirectoryTreeObject({
                ...directoryTreeObject,
                children: directoryTreeObject.children.map((c) =>
                  c.id === updatedChild.id ? updatedChild : c
                ),
              });
            }
          }}
        />
      ))}
    </div>
  );
};

export default DirectoryRenderer;
