#include <bits/stdc++.h>
using namespace std;
#define N 1000

int main() {
	int t;
	cin>>t;
	vector<int> v(3);
	while(t--) {
		cin>>v[0]>>v[1]>>v[2];
		sort(v.begin(),v.end());
		if(v[2]+v[1] >=10) cout<<"YES\n";
		else cout<<"NO\n";
	}
	return 0;
}