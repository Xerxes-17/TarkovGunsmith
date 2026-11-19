# FrontEnd Process - Dope Tables

## Ammo/Weapon

- User selects Caliber.
- User selects Weapon (**Default Ammo**).
- User selects **Used Ammo**.

### Branch A

- Manual User Input of **Velocity Modifier**.

### Branch B

- User selects Barrel (if any).
- User selects Muzzle Devices.
- Automatic Determination of **Velocity Modifier**.

### Branch C - Custom

- Manual user input of all fields for: (**DefaultAmmo**, **UsedAmmo**, **VelocityModifier**, **sightLineHeightOverBore**).

## Sim Parameters

- User selects **Max Distance**, forced to use 10m intervals.

### Zero

- User selects **Sighting Zero**, and is forced to use default **sightLineHeightOverBore**.

#### Zero alternative

- User Selects Optic/Sight (Also selects **sightLineHeightOverBore**).
  - This would also change the intervals, like for 75m -> includes 25m intervals.
- User Selects valid Calibration Distance from options.

#### Intervals alternative

- After selecting the Max Distance, the user can select checkboxes for intervals.
