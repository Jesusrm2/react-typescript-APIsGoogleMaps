import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography
} from "@mui/material";
import { Result } from "../../interfaces/poi";

type PoiModalProps = {
  pois: Result[];
  selectedPoiIndex: number;
  selectecdayPoiIndex: number;
  selectedPoiListIndex: number;
  modalOpen: boolean;
  onPoiChange: (index: number, poi: any) => void;
  onModalClose: () => void;
  onSaveChange: () => void;
};

const PoiModal = ({
  pois,

  selectedPoiListIndex,
  modalOpen,
  onPoiChange,
  onModalClose,
  onSaveChange
}: PoiModalProps) => {
  return (
    <Modal open={modalOpen} onClose={onModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxWidth: 500,
          maxHeight: 500,
          overflow: "auto"
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Seleccione un POI
        </Typography>
        <List>
          {pois.map((poi: Result, index: number) => (
            <ListItem
              key={poi.place_id}
              button
              selected={index === selectedPoiListIndex}
              onClick={() => onPoiChange(index, poi)}
            >
              <ListItemText primary={poi.name} secondary={poi.types[0]} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={onModalClose}>
          Cerrar
        </Button>
        <Button variant="contained" onClick={onSaveChange}>
          Guardar cambio
        </Button>
      </Box>
    </Modal>
  );
};

export default PoiModal;
