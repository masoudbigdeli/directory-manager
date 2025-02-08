import { useState, useCallback } from "react";
import FolderIcon from "../../components/icons/folder-icon";
import { DirNameWrapper, DirWrapper } from "../../styles/pages/home";
import PlusIcon from "../../components/icons/plus-icon";
import MinusIcon from "../../components/icons/minus-icon";
import { StatusButtons } from "../../styles/pages/home";
export interface directoryManager {
  id: string;
  name: string;
  children: directoryManager[];
  layerIndex: number;
}

interface DirectoryRendererProps {
  directory: directoryManager;
  onEnterHandler: (dir: directoryManager) => void;
  checkDuplicate?: (name: string) => boolean;
}

const DirectoryRenderer: React.FC<DirectoryRendererProps> = ({
  directory,
  onEnterHandler,
  checkDuplicate,
}) => {
  const [directoryTreeObject, setDirectoryTreeObject] = useState(directory);
  const [isEditing, setIsEditing] = useState(directory.name === "");
  const [inputValue, setInputValue] = useState("");

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const isValid = e.currentTarget.checkValidity();
        if (isValid && inputValue.trim() !== "") {
          const duplicateExists = checkDuplicate
            ? checkDuplicate(inputValue.trim())
            : directoryTreeObject.children.some(
              (child) => child.name === inputValue.trim()
            );
          if (duplicateExists) {
            alert("It's duplicate name!");
            return;
          }
          setDirectoryTreeObject({
            ...directoryTreeObject,
            name: inputValue.trim(),
          });
          setIsEditing(false);
          onEnterHandler({ ...directoryTreeObject, name: inputValue.trim() });
        } else {
          alert("Please enter a folder name");
        }
      }
    },
    [directoryTreeObject, inputValue, checkDuplicate, onEnterHandler]
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
          autoFocus
        />
      ) : (
        <DirWrapper>
          <DirNameWrapper>
            <div className="icon">
              <FolderIcon />
            </div>
            <div className="title">
              <span>{directoryTreeObject.name}</span>
            </div>
            <StatusButtons onClick={addChild}><PlusIcon/></StatusButtons>
            <StatusButtons onClick={removeSelf}><MinusIcon/></StatusButtons>
          </DirNameWrapper>

        </DirWrapper>
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
          checkDuplicate={(name: string) =>
            directoryTreeObject.children.some((child) => child.name === name)
          }
        />
      ))}
    </div>
  );
};

export default DirectoryRenderer;
