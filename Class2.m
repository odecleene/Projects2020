% Owen DeCleene
% 9/6/19
% ECE 202 Class 2
% Finding the shortest stopping distance on a flat road

clear   % clears all variables in the workspace; avoids common errors
clc   % clears command window

% ------ given information ------

% using ; to suppress output
m = 850;   % mass of car, in kg
v0 = 20;   % initial velocity, in m/s
vf = 0;   % final velocity, in m/s
uk = 0.1;   % coefficient of kinetic friction, in N/N
us = 0.4;   % coefficient of static friction, in N/N
g = 10;   % gravitational constant, in N/kg


% ----- calculations --------

Fnetx = -us*m*g   % max net force, use us, in N; answer to (a)

ax = Fnetx/m   % max acceleration, in m/s^2, andswer to (b)

t_min = (vf-v0)/ax;   % min stopping time, in s

d_min = v0*t_min + (1/2)*ax*t_min^2   % min stopping distance, in m


% ------- check answers --------

% use energy conservation, because I used N2L and kinematics

dKE = (1/2)*m*(v0^2 - vf^2);   %change in KE, in J
E_therm = abs(Fnetx)*d_min;   % mechanical energy converted to themal energy, in J

checkEnergy = dKE - E_therm   % energy conservation, in J; should be 0



