import React, { useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

export default function FormControlLabelPosition(props) {
  const [switchOn, setSwitchOn] = React.useState(true);

  useEffect(() => {
    setSwitchOn(props.active);
  }, [props.active]);

  useEffect(() => {
    props.switchStateHandler(switchOn);
  }, [switchOn]);

  const handleChange = () => {
    if (switchOn) {
      setSwitchOn(false);
    } else {
      setSwitchOn(true);
    }
  };

  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="start"
          checked={switchOn}
          onChange={handleChange}
          control={<Switch color="primary" />}
          label="Include in shopping list"
          labelPlacement="start"
        />
      </FormGroup>
    </FormControl>
  );
}
