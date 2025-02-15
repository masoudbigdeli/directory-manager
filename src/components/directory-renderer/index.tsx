import React, { useState, useCallback, useMemo } from "react";
import FolderIcon from "../../components/icons/folder-icon";
import FileIcon from "../../components/icons/file-icon";
import { DirNameWrapper, DirWrapper } from "../../styles/pages/home";
import AddDirectoryIcon from "../icons/add-directory-icon";
import RemoveIcon from "../icons/remove-icon";
import ArrowIcon from "../icons/arrow-icon";
import AddFileIcon from "../icons/add-file-icon";
import { StatusButtons, InputElement } from "../../styles/pages/home";

export interface DirectoryManager {
  id: string;
  name: string;
  children: Array<DirectoryManager | FileManager>;
  layerIndex: number;
  isExtended: boolean;
}

export interface FileManager {
  id: string;
  file: File | null;
  layerIndex: number;
}

export interface DirectoryAndFileRendererProps {
  directoryOrFile: DirectoryManager | FileManager;
  onEnterHandler: (node: DirectoryManager | FileManager) => void;
  checkDuplicate?: (name: string, type: "file" | "directory") => boolean;
  fileContent: string | null;
  onFileContentChange?: (newContent: string) => void;
  onFileOpen?: (fileId: string) => void;
}

const DirectoryAndFileRenderer = (props: DirectoryAndFileRendererProps) => {
  const {
    fileContent,
    directoryOrFile,
    onEnterHandler,
    checkDuplicate,
    onFileContentChange,
    onFileOpen,
  } = props;

  // Local state only for temporary UI (editing text)
  const [isEditing, setIsEditing] = useState<boolean>(
    "file" in directoryOrFile
      ? (directoryOrFile as FileManager).file === null
      : (directoryOrFile as DirectoryManager).name === ""
  );
  const [inputValue, setInputValue] = useState("");

  const iconRotationHandler = useCallback(() => {
    if ("isExtended" in directoryOrFile) {
      const updated: DirectoryManager = {
        ...directoryOrFile,
        isExtended: !directoryOrFile.isExtended,
      };
      onEnterHandler(updated);
    }
  }, [directoryOrFile, onEnterHandler]);

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const isValid = e.currentTarget.checkValidity();
        const typedValue = inputValue.trim();
        if (isValid && typedValue !== "") {
          const isFile = "file" in directoryOrFile;
          const finalName = isFile
            ? typedValue.endsWith(".txt")
              ? typedValue
              : typedValue + ".txt"
            : typedValue;
          const duplicateExists = checkDuplicate
            ? checkDuplicate(finalName, isFile ? "file" : "directory")
            : false;
          if (duplicateExists) {
            alert("It's duplicate name!");
            return;
          }
          if (isFile) {
            const updated: FileManager = {
              ...directoryOrFile,
              file: new File([], finalName),
            } as FileManager;
            onEnterHandler(updated);
          } else {
            const updated: DirectoryManager = {
              ...directoryOrFile,
              name: finalName,
              isExtended: true,
            } as DirectoryManager;
            onEnterHandler(updated);
          }
          setIsEditing(false);
        } else {
          alert("Please enter a valid name");
        }
      }
    },
    [directoryOrFile, inputValue, onEnterHandler, checkDuplicate]
  );

  const addChild = useCallback(
    (type: "folder" | "file") => {
      if ("file" in directoryOrFile) return;
      if (type === "folder") {
        const newChild: DirectoryManager = {
          id: crypto.randomUUID(),
          name: "",
          children: [],
          layerIndex: (directoryOrFile as DirectoryManager).layerIndex + 1,
          isExtended: true,
        };
        const updated: DirectoryManager = {
          ...directoryOrFile,
          isExtended: true,
          children: [...(directoryOrFile as DirectoryManager).children, newChild],
        };
        onEnterHandler(updated);
      } else {
        const newFile: FileManager = {
          id: crypto.randomUUID(),
          layerIndex: (directoryOrFile as DirectoryManager).layerIndex + 1,
          file: null,
        };
        const updated: DirectoryManager = {
          ...directoryOrFile,
          children: [...(directoryOrFile as DirectoryManager).children, newFile],
        };
        onEnterHandler(updated);
      }
    },
    [directoryOrFile, onEnterHandler]
  );

  const removeSelf = useCallback(() => {
    if ("file" in directoryOrFile) {
      if ((directoryOrFile as FileManager).file) {
        const updated: FileManager = {
          ...directoryOrFile,
          file: new File([(directoryOrFile as FileManager).file!], "__REMOVE__"),
        };
        onEnterHandler(updated);
      }
    } else {
      onEnterHandler({ ...directoryOrFile, name: "__REMOVE__" });
    }
  }, [directoryOrFile, onEnterHandler]);

  const fileOpenHandler = useCallback(() => {
    if ("file" in directoryOrFile) {
      const fileManager = directoryOrFile as FileManager;
      if (fileManager.file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (onFileContentChange) {
            onFileContentChange(event.target?.result as string);
          }
        };
        reader.readAsText(fileManager.file);
        if (onFileOpen) {
          onFileOpen(directoryOrFile.id);
        }
      } else {
        alert("There is no file to read!");
      }
    }
  }, [directoryOrFile, onFileContentChange, onFileOpen]);

  const fieldName = useMemo(() => {
    return "file" in directoryOrFile
      ? (directoryOrFile as FileManager).file?.name
      : (directoryOrFile as DirectoryManager).name;
  }, [directoryOrFile]);

  return (
    <div
      style={{
        marginLeft:
          directoryOrFile.layerIndex === 0 ? "0" : directoryOrFile.layerIndex + 15,
        borderLeft:
          directoryOrFile.layerIndex === 0 || isEditing ? "none" : "1px solid black",
      }}
    >
      {isEditing ? (
        <InputElement
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onEnter}
          autoFocus
        />
      ) : (
        <DirWrapper>
          <DirNameWrapper>
            <div className="icon" onClick={iconRotationHandler}>
              {"isExtended" in directoryOrFile &&
              (directoryOrFile as DirectoryManager).children.length !== 0 ? (
                <ArrowIcon rotated={(directoryOrFile as DirectoryManager).isExtended} />
              ) : (
                <div style={{ width: directoryOrFile.layerIndex === 0 ? 0 : "1.5rem" }}></div>
              )}
              {"isExtended" in directoryOrFile ? (
                <FolderIcon width={1.3} />
              ) : (
                <div style={{ cursor: "pointer" }} onClick={fileOpenHandler}>
                  <FileIcon />
                </div>
              )}
            </div>
            <div className="title">
              <span>{fieldName}</span>
            </div>
            {"isExtended" in directoryOrFile ? (
              <>
                <StatusButtons onClick={() => addChild("folder")}>
                  <AddDirectoryIcon />
                </StatusButtons>
                <StatusButtons onClick={removeSelf}>
                  <RemoveIcon />
                </StatusButtons>
                <StatusButtons onClick={() => addChild("file")}>
                  <AddFileIcon />
                </StatusButtons>
              </>
            ) : (
              <StatusButtons onClick={removeSelf}>
                <RemoveIcon />
              </StatusButtons>
            )}
          </DirNameWrapper>
        </DirWrapper>
      )}
      {"isExtended" in directoryOrFile && (
        <div
          style={{
            display:
              (directoryOrFile as DirectoryManager).isExtended ? "block" : "none",
          }}
        >
          {(directoryOrFile as DirectoryManager).children.map((child) => (
            <DirectoryAndFileRenderer
              key={child.id}
              directoryOrFile={child}
              onEnterHandler={(updatedChild) => {
                // Replace the updated child in the children array.
                let updatedChildren = (directoryOrFile as DirectoryManager).children.map((c) =>
                  c.id === updatedChild.id ? updatedChild : c
                );
                // Remove any child signaling removal.
                updatedChildren = updatedChildren.filter((c) =>
                  "name" in c ? c.name !== "__REMOVE__" : c.file?.name !== "__REMOVE__"
                );
                const updatedNode: DirectoryManager = {
                  ...directoryOrFile,
                  children: updatedChildren,
                };
                onEnterHandler(updatedNode);
              }}
              checkDuplicate={(name: string, type: "file" | "directory") => {
                const currentChildren = (directoryOrFile as DirectoryManager).children;
                return currentChildren.some((child) => {
                  const isChildFile = "file" in child;
                  if (type === "file") {
                    return isChildFile
                      ? (child as FileManager).file?.name === name
                      : false;
                  } else {
                    return !isChildFile
                      ? (child as DirectoryManager).name === name
                      : false;
                  }
                });
              }}
              fileContent={fileContent}
              onFileContentChange={onFileContentChange}
              onFileOpen={onFileOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectoryAndFileRenderer;
