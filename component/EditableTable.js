import { useState, useRef, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  IconButton,
  Grid,
  GridItem,
  TableCaption,
  useToast,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  CheckIcon,
  CloseIcon,
  AddIcon,
} from "@chakra-ui/icons";
import axios from "axios";

const EditableTable = ({ homeUser }) => {
  const initialData = [];
  const [data, setData] = useState(initialData);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editMode, setEditMode] = useState({});
  const firstRowRef = useRef(null);

  const handleEdit = (rowId) => {
    setEditMode((prev) => ({ ...prev, [rowId]: true }));
  };

  const handleSave = async (data) => {
    data.userId = homeUser?._id;
    const response = await fetch("/api/books", {
      method: "POST",
      headers: { Content_Type: "application/json" },
      body: JSON.stringify({
        data,
      }),
    });
    if (response.status === 200) {
      if (data._id) {
        toast({
          title: `Book Updated Successfully`,
          status: "info",
          isClosable: true,
        });
      } else {
        toast({
          title: `Book Created Successfully`,
          status: "success",
          isClosable: true,
        });
      }

      GetDataById(homeUser?._id);
    } else {
      //setStatus('error');
      toast({
        title: `Book Not Created Successfully`,
        status: "error",
        isClosable: true,
      });
    }
    setEditMode((prev) => ({ ...prev, [data.id]: false }));
    setData((prevData) => prevData.sort((a, b) => (a.id < b.id ? -1 : 1)));
  };

  const handleCancel = (rowId) => {
    setEditMode((prev) => ({ ...prev, [rowId]: false }));
  };

  const handleDelete = (bookId) => {
    const url = `http://localhost:3000/api/books?id=${encodeURIComponent(
      bookId
    )}`;

    axios
      .delete(url)
      .then((response) => {
        toast({
          title: `Book Deleted Successfully`,
          status: "error",
          isClosable: true,
        });
        GetDataById(homeUser?._id);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log(error.message); // Network or other error
        }
      });
    //setData((prevData) => prevData.filter((row) => row.id !== rowId));
  };

  const handleChange = (event, rowId, field) => {
    const { value } = event.target;
    setData((prevData) =>
      prevData.map((row) => {
        if (row.id === rowId) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };
  const handleChangeForm = (event, field) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    if (homeUser) {
      GetDataById(homeUser?._id);
    }
  }, [homeUser]);

  const GetDataById = (userId) => {
    const url = `http://localhost:3000/api/books?id=${encodeURIComponent(
      userId
    )}`;
    axios
      .get(url)
      .then((response) => {
        // Handle successful response
        setData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        // Handle error response
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log(error.message); // Network or other error
        }
      });
  };

  const handleAddRow = () => {
    const newRowId = data.length + 1;
    const newRow = {
      id: newRowId,
      title: "",
      author: "",
      genre: "",
      year: "",
      isbn: "",
    };

    setData((prevData) => [newRow, ...prevData]);
    setEditMode((prev) => ({ ...prev, [newRowId]: true }));

    setTimeout(() => {
      if (firstRowRef.current) {
        firstRowRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={5}>
        <GridItem w="100%" h="10" bg="blue.500">
          <Input
            name="name"
            value={homeUser?.name}
            onChange={(event) => handleChangeForm(event, "name")}
            placeholder="name"
            backgroundColor="white"
            disabled
            sx={{ opacity: "0.9 !important" }}
          />
        </GridItem>
        <GridItem w="100%" h="10" bg="blue.500">
          <Input
            name="phone"
            value={homeUser?.phone}
            onChange={(event) => handleChangeForm(event, "phone")}
            placeholder="phone"
            backgroundColor="white"
            disabled
            sx={{ opacity: "0.9 !important" }}
          />
        </GridItem>
        <GridItem w="100%" h="10" bg="blue.500">
          <Input
            name="email"
            value={homeUser?.email}
            onChange={(event) => handleChangeForm(event, "email")}
            placeholder="email"
            backgroundColor="white"
            disabled
            sx={{ opacity: "0.9 !important" }}
          />
        </GridItem>
      </Grid>
      <IconButton
        variant="outline"
        mt={5}
        colorScheme="teal"
        isDisabled={homeUser ? false : true}
        aria-label="Add"
        icon={<AddIcon />}
        onClick={handleAddRow}
      />

      <Table variant="striped" mt={5}>
        <Thead>
          <Tr>
            <Th>S. No</Th>
            <Th>Book Title</Th>
            <Th>Author</Th>
            <Th>Genre</Th>
            <Th>Year of Publication</Th>
            <Th>ISBN</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((row, index) => (
            <Tr key={row.id} ref={index === 0 ? firstRowRef : null}>
              <Td>{row.id}</Td>
              <Td>
                {editMode[row.id] ? (
                  <Input
                    outline="2px solid teal"
                    value={row.title}
                    onChange={(event) => handleChange(event, row.id, "title")}
                  />
                ) : (
                  row.title
                )}
              </Td>
              <Td>
                {editMode[row.id] ? (
                  <Input
                    outline="2px solid teal"
                    value={row.author}
                    onChange={(event) => handleChange(event, row.id, "author")}
                  />
                ) : (
                  row.author
                )}
              </Td>
              <Td>
                {editMode[row.id] ? (
                  <Input
                    outline="2px solid teal"
                    value={row.genre}
                    onChange={(event) => handleChange(event, row.id, "genre")}
                  />
                ) : (
                  row.genre
                )}
              </Td>
              <Td>
                {editMode[row.id] ? (
                  <Input
                    outline="2px solid teal"
                    value={row.year}
                    onChange={(event) => handleChange(event, row.id, "year")}
                  />
                ) : (
                  row.year
                )}
              </Td>
              <Td>
                {editMode[row.id] ? (
                  <Input
                    outline="2px solid teal"
                    value={row.isbn}
                    onChange={(event) => handleChange(event, row.id, "isbn")}
                  />
                ) : (
                  row.isbn
                )}
              </Td>
              <Td>
                {editMode[row.id] ? (
                  <>
                    <IconButton
                      aria-label="Save"
                      icon={<CheckIcon />}
                      onClick={() => handleSave(row)}
                    />
                    <IconButton
                      aria-label="Cancel"
                      icon={<CloseIcon />}
                      onClick={() => handleCancel(row.id)}
                    />
                  </>
                ) : (
                  <>
                    <IconButton
                      aria-label="Edit"
                      icon={<EditIcon />}
                      onClick={() => handleEdit(row.id)}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(row._id)}
                    />
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
        {/* <tfoot>
        <Tr>
          <Td colSpan={7} textAlign="center">
            No Data
          </Td>
        </Tr>
      </tfoot> */}
      </Table>
    </>
  );
};

export default EditableTable;
