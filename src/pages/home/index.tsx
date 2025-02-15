import React, { useCallback, useRef, useState } from "react";
import HomeWrapper, {
  MenuWrapper,
  TextAreaWrapper,
  EditorWrapper,
  Button,
  HeadersWrapper,
  BodyWrapper,
  StatusButtons,
} from "../../styles/pages/home";
import DirectoryAndFileRenderer, {
  DirectoryManager,
  FileManager,
  DirectoryAndFileRendererRef,
} from "../../components/directory-renderer";
import PlusIcon from "../../components/icons/add-directory-icon";

export default function Home() {
  const [treeObject, setTreeObject] = useState<DirectoryManager | FileManager | null>(null);
  const [textValue, setTextValue] = useState("");
  // Track which file (by id) is currently open.
  const [openFileId, setOpenFileId] = useState<string | null>(null);

  // Ref to access the top-level DirectoryAndFileRenderer's up‑to‑date local state.
  const directoryRendererRef = useRef<DirectoryAndFileRendererRef>(null);

  // Whenever a change occurs in the child tree, update Home’s state.
  const handleOnEnter = useCallback((object: DirectoryManager | FileManager) => {
    // For removals, we set treeObject to null.
    if (
      ("name" in object && object.name === "__REMOVE__") ||
      ("file" in object && object.file?.name === "__REMOVE__")
    ) {
      setTreeObject(null);
    } else {
      setTreeObject(object);
    }
  }, []);

  const handleFileContentChange = useCallback((newContent: string) => {
    setTextValue(newContent);
  }, []);

  // Recursively update the file node (identified by openFileId) with the new text.
  const updateFileInTree = (
    node: DirectoryManager | FileManager
  ): DirectoryManager | FileManager => {
    if ("file" in node) {
      if (node.id === openFileId && node.file) {
        const fileName = node.file.name;
        const updatedFile = new File([textValue], fileName, { type: "text/plain" });
        return { ...node, file: updatedFile };
      }
      return node;
    } else {
      return {
        ...node,
        children: node.children.map((child) => updateFileInTree(child)),
      };
    }
  };

  const handleSave = useCallback(() => {
    // Grab the current tree from the DirectoryAndFileRenderer’s local state.
    let currentTree: DirectoryManager | FileManager | null = treeObject;
    if (directoryRendererRef.current) {
      currentTree = directoryRendererRef.current.getCurrentTree();
    }
    if (openFileId && currentTree) {
      const updatedTree = updateFileInTree(currentTree);
      setTreeObject(updatedTree);
      alert(`File changes saved! (Open File ID: ${openFileId})`);
    } else if (currentTree && "file" in currentTree && currentTree.file) {
      const fileName = currentTree.file.name;
      const updatedFile = new File([textValue], fileName, { type: "text/plain" });
      setTreeObject({ ...currentTree, file: updatedFile });
      alert(`${fileName} changes saved! :)`);
    } else {
      alert("No file is currently open to save.");
    }
  }, [openFileId, treeObject, textValue]);

  return (
    <HomeWrapper>
      <MenuWrapper>
        <HeadersWrapper>
          <span>Directory Manager</span>
          {!treeObject && (
            <StatusButtons
              onClick={(e) => {
                setTreeObject({
                  id: crypto.randomUUID(),
                  name: e.currentTarget.value,
                  children: [],
                  layerIndex: 0,
                  isExtended: true,
                });
              }}
            >
              <PlusIcon />
            </StatusButtons>
          )}
        </HeadersWrapper>
        <BodyWrapper>
          {treeObject && (
            <DirectoryAndFileRenderer
              ref={directoryRendererRef} // Pass the ref to access the local state.
              directoryOrFile={treeObject}
              onEnterHandler={handleOnEnter}
              fileContent={textValue}
              onFileContentChange={handleFileContentChange}
              // When a file is opened, store its id.
              onFileOpen={(fileId: string) => setOpenFileId(fileId)}
            />
          )}
        </BodyWrapper>
      </MenuWrapper>
      <EditorWrapper>
        <TextAreaWrapper
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        <Button
          style={{
            border: "2px solid rgba(22, 21, 21, 0.24)",
            width: "4rem",
            backgroundColor: "#009c82",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            float: "right",
            padding: "0.75rem",
            margin: "0.3rem",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          <span style={{ color: "rgb(30, 59, 155)", fontSize: "1rem" }}>
            Save
          </span>
        </Button>
      </EditorWrapper>
    </HomeWrapper>
  );
}
