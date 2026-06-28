# Cat's Eye
# Concentric iris rings + vertical slit pupil + corneal highlight
# Trick: go to circumference first (MOVE r), face east (RIGHT 90),
# then DO 36 / MOVE step / RIGHT 10 / END draws a circle centered on canvas center

STROKE 20

# Inner iris: warm yellow glow near pupil
CENTER
PEN UP
DIR NORTH
MOVE 16
RIGHT 90
COLOR YELLOW
PEN DOWN
DO 36
MOVE 3
RIGHT 10
END
PEN UP

# Mid iris: rich green
CENTER
DIR NORTH
MOVE 34
RIGHT 90
COLOR GREEN
PEN DOWN
DO 36
MOVE 6
RIGHT 10
END
PEN UP

# Outer iris: golden yellow
CENTER
DIR NORTH
MOVE 52
RIGHT 90
COLOR YELLOW
PEN DOWN
DO 36
MOVE 9
RIGHT 10
END
PEN UP

# Limbal ring: dark blue outer edge
CENTER
DIR NORTH
MOVE 70
RIGHT 90
COLOR BLUE
PEN DOWN
DO 36
MOVE 12
RIGHT 10
END
PEN UP

# Vertical slit pupil
CENTER
DIR NORTH
MOVE 62
COLOR PURPLE
STROKE 28
PEN DOWN
DIR SOUTH
MOVE 124
PEN UP

# White corneal reflection (upper right)
CENTER
DIR NORTH
MOVE 35
DIR EAST
MOVE 22
COLOR WHITE
STROKE 4
PEN DOWN
DO 18
MOVE 4
RIGHT 20
END
PEN UP
