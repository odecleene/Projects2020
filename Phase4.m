% Owen DeCleene
% 12/11/19
% ECE 202, Fall 2019
% Project 1, Phase 4
%
% Making the script for the Power Series Expansion of A cos(wt) more
% efficient using a for loop


clear
clf
format shortG

phase = 4;


% -------------- definitions -----------

num = 6;  % number of terms to calculate
nMax = (num-1)*2;
n = 0:2:nMax;  % array of n n-values

A = 12; % amplitude of given sinusoid
w = 40; % angular frequency of given sinusoid

tmin = 0; % minimum time, in s
tmax = 0.2; % maximum time, in s
N = 400; % number of intervals


% ----- define array of coefficients -----

a = A *(-1).^(n/2).*w.^n ./ factorial(n); % array of coefficients a_n
table = [n; a]'


% -- define 6 functions of the form (a_i)(t^n) --

t = linspace(tmin, tmax, N+1); % linear time space, in s
tms = t*1000; % time space, in ms, for plotting

% first 'num' non-zero Taylor expansion terms, functions of t
subtotal = zeros(1, N+1);
for m = 1:num;

    subtotal = subtotal + a(m) * t.^n(m);
    % if m < num, --> width = 1
    % if m = num, -- width = 3
    plot(tms, subtotal, 'LineWidth', 2 * floor(m/num) + 1)
    hold on

end


% ------- plotting the functions -------------

ax = gca;
ax.FontSize = 15;

title({sprintf('ECE 202, Project 1, Phase %g:', phase),...
    sprintf('Partial Sum of %gcos(%gt) up to %g Non-Zero Terms',...
    A, w, num)}, 'FontSize', 24)
xlabel('Time, t (ms)', 'FontSize', 18);
ylabel('f(t)', 'FontSize', 18)
legend("up to n = " + n, 'Location', 'EastOutside');

vertLim = A*5/4;
axis([-inf inf -vertLim vertLim])


% ------------ check using Phase 3 code --------

f1 = a(1) * t.^n(1);
f2 = f1 + a(2) * t.^n(2);
f3 = f2 + a(3) * t.^n(3);
f4 = f3 + a(4) * t.^n(4);
f5 = f4 + a(5) * t.^n(5);
f6 = f5 + a(6) * t.^n(6);

% difference between two methods of computation, should be zero
checkPartialSum = sum(abs(subtotal - f6))  

% NOTE: the output from this phase looks the same as the output of Phase 3


