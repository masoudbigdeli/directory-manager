import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  onEnterHandler: (dirOrFile: DirectoryManager | FileManager) => void;
  checkDuplicate?: (name: string, type: "file" | "directory") => boolean;
  fileContent: string | null;
  onFileContentChange?: (newContent: string) => void;
  // Callback to notify Home which file was opened (by its id)
  onFileOpen?: (fileId: string) => void;
}

// Expose methods via ref.
export interface DirectoryAndFileRendererRef {
  getCurrentTree: () => DirectoryManager | FileManager;
}

// Using local state for immediate UI updates while also bubbling changes upward.
const DirectoryAndFileRenderer = forwardRef<
  DirectoryAndFileRendererRef,
  DirectoryAndFileRendererProps
>(
  (
    {
      directoryOrFile,
      onEnterHandler,
      checkDuplicate,
      fileContent,
      onFileContentChange,
      onFileOpen,
    },
    ref
  ) => {
    // localValue holds the current tree state (including children, renames, etc.)
    const [localValue, setLocalValue] = useState<DirectoryManager | FileManager>(directoryOrFile);
    const [isEditing, setIsEditing] = useState<boolean>(
      "file" in directoryOrFile
        ? (directoryOrFile as FileManager).file === null
        : (directoryOrFile as DirectoryManager).name === ""
    );
    const [inputValue, setInputValue] = useState("");

    // When the prop changes, update our local state.
    useEffect(() => {
      setLocalValue(directoryOrFile);
    }, [directoryOrFile]);

    // Expose the up‑to‑date local tree to the parent.
    useImperativeHandle(
      ref,
      () => ({
        getCurrentTree: () => localValue,
      }),
      [localValue]
    );

    const iconRotationHandler = useCallback(() => {
      if ("isExtended" in localValue) {
        setLocalValue((prev) => ({
          ...prev,
          isExtended: !(prev as DirectoryManager).isExtended,
        }));
      }
    }, [localValue]);

    const onEnter = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          const isValid = e.currentTarget.checkValidity();
          const typedValue = inputValue.trim();
          if (isValid && typedValue !== "") {
            const isFile = "file" in localValue;
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
              const updated = { ...localValue, file: new File([], finalName) } as FileManager;
              setLocalValue(updated);
              onEnterHandler(updated);
            } else {
              const updated = { ...localValue, name: finalName, isExtended: true } as DirectoryManager;
              setLocalValue(updated);
              onEnterHandler(updated);
            }
            setIsEditing(false);
          } else {
            alert("Please enter a valid name");
          }
        }
      },
      [localValue, inputValue, onEnterHandler, checkDuplicate]
    );

    const addChild = useCallback(
      (type: "folder" | "file") => {
        if ("file" in localValue) return; // Do nothing if current node is a file.
        if (type === "folder") {
          const newChild: DirectoryManager = {
            id: crypto.randomUUID(),
            name: "",
            children: [],
            layerIndex: (localValue as DirectoryManager).layerIndex + 1,
            isExtended: true,
          };
          const updated = {
            ...localValue,
            isExtended: true,
            children: [...(localValue as DirectoryManager).children, newChild],
          } as DirectoryManager;
          setLocalValue(updated);
          onEnterHandler(updated);
        } else {
          const newFile: FileManager = {
            id: crypto.randomUUID(),
            layerIndex: (localValue as DirectoryManager).layerIndex + 1,
            file: null,
          };
          const updated = {
            ...localValue,
            children: [...(localValue as DirectoryManager).children, newFile],
          } as DirectoryManager;
          setLocalValue(updated);
          onEnterHandler(updated);
        }
      },
      [localValue, onEnterHandler]
    );

    const removeSelf = useCallback(() => {
      if ("file" in localValue) {
        if ((localValue as FileManager).file) {
          const updated = {
            ...localValue,
            file: new File([(localValue as FileManager).file!], "__REMOVE__"),
          };
          onEnterHandler(updated);
        }
      } else {
        onEnterHandler({ ...localValue, name: "__REMOVE__" });
      }
    }, [localValue, onEnterHandler]);

    const fileOpenHandler = useCallback(() => {
      if ("file" in localValue) {
        const fileManager = localValue as FileManager;
        if (fileManager.file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (onFileContentChange) {
              onFileContentChange(event.target?.result as string);
            }
          };
          reader.readAsText(fileManager.file);
          if (onFileOpen) {
            onFileOpen(localValue.id);
          }
        } else {
          alert("There is no file to read!");
        }
      }
    }, [localValue, onFileContentChange, onFileOpen]);

    const fieldName = useMemo(() => {
      return "file" in localValue
        ? (localValue as FileManager).file?.name
        : (localValue as DirectoryManager).name;
    }, [localValue]);

    return (
      <div
        style={{
          marginLeft: localValue.layerIndex === 0 ? "0" : localValue.layerIndex + 15,
          borderLeft: localValue.layerIndex === 0 || isEditing ? "none" : "1px solid black",
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
                {"isExtended" in localValue &&
                (localValue as DirectoryManager).children.length !== 0 ? (
                  <ArrowIcon rotated={(localValue as DirectoryManager).isExtended} />
                ) : (
                  <div style={{ width: localValue.layerIndex === 0 ? 0 : "1.5rem" }}></div>
                )}
                {"isExtended" in localValue ? (
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
              {"isExtended" in localValue ? (
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
        {"isExtended" in localValue && (
          <div style={{ display: (localValue as DirectoryManager).isExtended ? "block" : "none" }}>
            {(localValue as DirectoryManager).children.map((child) => (
              <DirectoryAndFileRenderer
                key={child.id}
                directoryOrFile={child}
                onEnterHandler={(updatedChild) => {
                  if (
                    ("name" in updatedChild && updatedChild.name === "__REMOVE__") ||
                    ("file" in updatedChild && updatedChild.file?.name === "__REMOVE__")
                  ) {
                    const updated = {
                      ...localValue,
                      children: (localValue as DirectoryManager).children.filter((c) => c.id !== child.id),
                    } as DirectoryManager;
                    setLocalValue(updated);
                    onEnterHandler(updated);
                  } else {
                    const updated = {
                      ...localValue,
                      children: (localValue as DirectoryManager).children.map((c) =>
                        c.id === updatedChild.id ? updatedChild : c
                      ),
                    } as DirectoryManager;
                    setLocalValue(updated);
                    onEnterHandler(updated);
                  }
                }}
                checkDuplicate={(name: string, type: "file" | "directory") => {
                  const currentChildren = (localValue as DirectoryManager).children;
                  return currentChildren.some((child) => {
                    const isChildFile = "file" in child;
                    if (type === "file") {
                      return isChildFile ? (child as FileManager).file?.name === name : false;
                    } else {
                      return !isChildFile ? (child as DirectoryManager).name === name : false;
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
  }
);

export default DirectoryAndFileRenderer;
